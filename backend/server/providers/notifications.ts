import { createTransport } from 'nodemailer';
import { supabaseRest } from '../db/supabase';

export interface EmailProvider {
  send(params: { to: string; subject: string; html: string }): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface SmsProvider {
  send(params: { to: string; body: string }): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

/**
 * Brevo email provider (warning emails).
 *
 * ONE transport: Brevo SMTP via Nodemailer (STARTTLS on port 587). No Brevo
 * HTTP API, no API keys — the SMTP key (xsmtpsib-…) is used purely as the
 * SMTP password. All credentials come from environment variables:
 *
 *   BREVO_SMTP_HOST  (default smtp-relay.brevo.com)
 *   BREVO_SMTP_PORT  (default 587)
 *   BREVO_SMTP_LOGIN (SMTP username)
 *   BREVO_SMTP_KEY   (SMTP password — never logged)
 *   EMAIL_FROM       (validated sender, "Name <mail@host>" or plain address)
 */
class BrevoEmailProvider implements EmailProvider {
  private transport: ReturnType<typeof createTransport> | null = null;

  constructor(
    private host: string,
    private port: number,
    private user: string,
    private pass: string,
    private from: string,
  ) {
    this.transport = createTransport({
      host: this.host,
      port: this.port,
      secure: false, // 587 uses STARTTLS
      auth: { user: this.user, pass: this.pass },
    });
  }

  async send(params: { to: string; subject: string; html: string }) {
    if (!this.transport) {
      return { success: false, error: 'Brevo SMTP transport is not initialized' };
    }
    try {
      const info = await this.transport.sendMail({
        from: this.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      // Nodemailer surfaces auth failures (EAUTH), connection failures
      // (ECONREFUSED/ETIMEDOUT), and SMTP rejections here — all are failures,
      // never reported as sent.
      const code = (err as { code?: string }).code;
      const message = (err as Error).message?.split('\n')[0]?.slice(0, 300) || 'unknown SMTP error';
      console.error(`[email] Brevo SMTP send failed${code ? ` (${code})` : ''}: ${message}`);
      return { success: false, error: `Brevo SMTP${code ? ` ${code}` : ''}: ${message}` };
    }
  }
}

class TwilioSmsProvider implements SmsProvider {
  constructor(private accountSid: string, private authToken: string, private fromNumber: string) {}

  async send(params: { to: string; body: string }) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const body = new URLSearchParams({
        To: params.to,
        From: this.fromNumber,
        Body: params.body,
      });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        // Surface trial-specific rejections (e.g. 572006 "Invalid template name.")
        // as a normal FAILED result — never a fake success.
        return { success: false, error: `Twilio HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      const data = (await response.json()) as { sid?: string };
      return { success: true, messageId: data.sid };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}

/**
 * Fast2SMS — India-first OTP/alert provider with no trial-template restrictions.
 * https://docs.fast2sms.com/ — quick SMS route supports arbitrary bodies with
 * only an authorization key.
 */
class Fast2SmsProvider implements SmsProvider {
  constructor(private apiKey: string) {}

  async send(params: { to: string; body: string }) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: { authorization: this.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: 'q', // quick transactional route (free credits work here)
          message: params.body,
          language: 'english',
          flash: 0,
          numbers: params.to.replace(/^\+91/, '').replace(/\D/g, ''),
        }),
      });
      const text = await response.text();
      let data: { return?: boolean; message?: unknown } = {};
      try { data = JSON.parse(text); } catch { /* non-JSON body */ }
      if (!response.ok || data.return === false) {
        return { success: false, error: `Fast2SMS HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      return { success: true, messageId: String((data.message as string) || 'fast2sms') };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}

/**
 * MSG91 — Indian OTP specialist. Uses the flow-less send API with an authkey.
 * https://docs.msg91.com/
 */
class Msg91Provider implements SmsProvider {
  constructor(private authKey: string, private senderId: string) {}

  async send(params: { to: string; body: string }) {
    try {
      const response = await fetch('https://api.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: { authkey: this.authKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: this.senderId || 'AAPDAS',
          mobiles: `91${params.to.replace(/^\+91/, '').replace(/\D/g, '')}`,
          MESSAGE: params.body,
        }),
      });
      const text = await response.text();
      let data: { type?: string; message?: string } = {};
      try { data = JSON.parse(text); } catch { /* non-JSON body */ }
      if (!response.ok || data.type === 'error') {
        return { success: false, error: `MSG91 HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      return { success: true, messageId: data.message || 'msg91' };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }
}

/**
 * Development-only SMS provider: logs the message and reports success.
 * Active only when DEV_OTP_MODE=true — never auto-enabled, never in production.
 */
class DevSmsProvider implements SmsProvider {
  async send(params: { to: string; body: string }) {
    console.log(`[DEV SMS MODE] to=${params.to} body=${params.body.slice(0, 300)}`);
    return { success: true, messageId: 'dev-mode' };
  }
}

let emailProvider: EmailProvider | null = null;
let smsProvider: SmsProvider | null = null;

export function getEmailProvider(): EmailProvider | null {
  if (emailProvider) return emailProvider;
  const providerType = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  const host = process.env.BREVO_SMTP_HOST?.trim() || 'smtp-relay.brevo.com';
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const user = process.env.BREVO_SMTP_LOGIN?.trim();
  const pass = process.env.BREVO_SMTP_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (providerType !== 'brevo') {
    if (providerType) console.warn(`[email] Unknown EMAIL_PROVIDER "${providerType}" — expected "brevo"`);
    return null;
  }
  // Required: login, key, sender. Host/port have sane defaults above.
  const missing = [
    !user && 'BREVO_SMTP_LOGIN',
    !pass && 'BREVO_SMTP_KEY',
    !from && 'EMAIL_FROM',
  ].filter(Boolean) as string[];
  if (missing.length) {
    console.error(`[email] Brevo SMTP not configured — missing env: ${missing.join(', ')}`);
    return null;
  }
  emailProvider = new BrevoEmailProvider(host, port, user!, pass!, from!);
  return emailProvider;
}

export function getSmsProvider(): SmsProvider | null {
  if (smsProvider) return smsProvider;
  const providerType = process.env.SMS_PROVIDER?.trim().toLowerCase();
  const authToken = process.env.SMS_API_KEY?.trim();
  const accountSid = process.env.SMS_ACCOUNT_SID?.trim();
  const devMode = process.env.DEV_OTP_MODE === 'true';

  switch (providerType) {
    case 'twilio':
      if (authToken && accountSid) {
        smsProvider = new TwilioSmsProvider(accountSid, authToken, process.env.SMS_FROM_NUMBER?.trim() || '');
      }
      break;
    case 'fast2sms':
      if (authToken) {
        smsProvider = new Fast2SmsProvider(authToken);
      }
      break;
    case 'msg91':
      if (authToken) {
        smsProvider = new Msg91Provider(authToken, process.env.SMS_SENDER_ID?.trim() || 'AAPDAS');
      }
      break;
    case 'dev':
      smsProvider = new DevSmsProvider();
      break;
    default:
      if (devMode) smsProvider = new DevSmsProvider();
      break;
  }
  return smsProvider;
}

/** True when a real SMS provider (not dev logging) is configured. */
export function isRealSmsConfigured(): boolean {
  const type = process.env.SMS_PROVIDER?.trim().toLowerCase();
  if (type === 'dev') return false;
  return isSmsConfigured();
}

export function isEmailConfigured(): boolean {
  return getEmailProvider() !== null;
}

export function isSmsConfigured(): boolean {
  return getSmsProvider() !== null;
}

export async function sendNotificationEmail(params: {
  to: string;
  eventType: string;
  severity: string;
  location: string;
  description: string;
  sourceSummary: string;
  sourceUrls: string[];
  platformUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  const provider = getEmailProvider();
  if (!provider) return { success: false, error: 'Email provider is not configured' };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F1B29;">Aapda Drishti Alert</h2>
      <div style="background: ${params.severity === 'Extreme' ? '#FEE2E2' : '#FEF3C7'}; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong style="color: #0F1B29;">${params.eventType}</strong>
        <span style="color: #747F8D;"> - ${params.severity}</span>
        <p style="color: #46515E; margin: 8px 0 0;">${params.location}</p>
      </div>
      <p style="color: #46515E;">${params.description}</p>
      ${params.sourceUrls.length ? `<p style="color: #747F8D; font-size: 14px;">${params.sourceUrls.map((url) => `<a href="${url}">Source</a>`).join(' | ')}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #DDDDDD; margin: 16px 0;">
      <p style="color: #747F8D; font-size: 12px;">You received this because you have alerts enabled for your area. <a href="${params.platformUrl}">Manage settings</a></p>
    </div>`;

  return provider.send({
    to: params.to,
    subject: `[Aapda Drishti] ${params.severity} ${params.eventType} - ${params.location}`,
    html,
  });
}

export async function sendNotificationSms(params: {
  to: string;
  eventType: string;
  severity: string;
  location: string;
}): Promise<{ success: boolean; error?: string }> {
  const provider = getSmsProvider();
  if (!provider) return { success: false, error: 'SMS provider is not configured' };

  const body = `Aapda Drishti: ${params.severity} ${params.eventType} reported near ${params.location}. Check the platform for verified details.`;
  return provider.send({ to: params.to, body });
}

export type NotificationOutcome = 'created' | 'deduplicated' | 'failed';

/**
 * Full notification lifecycle with deterministic dedupe:
 *   existing row -> DEDUPLICATED (or return existing SENT)
 *   send provided -> QUEUED -> SENDING -> SENT | FAILED (error stored)
 *   send failed  -> FAILED with error_message, never SENT.
 */
export async function recordNotification(params: {
  userId: string;
  eventId: string;
  channel: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
  reason: string;
  dedupeKey: string;
  send?: () => Promise<void>;
}): Promise<NotificationOutcome> {
  try {
    const existing = await supabaseRest<Array<{ id: string; status: string }>>(
      `notifications?dedupe_key=eq.${encodeURIComponent(params.dedupeKey)}&select=id,status&limit=1`,
      { method: 'GET' },
    );

    if (existing[0]) {
      if (existing[0].status === 'FAILED' && params.send) {
        // Retry a previously failed send exactly once per run.
        await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'SENDING' }),
        });
        try {
          await params.send();
          await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'SENT', sent_at: new Date().toISOString(), error_message: null }),
          });
          return 'created';
        } catch (err) {
          await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'FAILED', error_message: (err as Error).message.slice(0, 500) }),
          });
          return 'failed';
        }
      }
      await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DEDUPLICATED' }),
      }).catch(() => undefined);
      return 'deduplicated';
    }

    // Idempotent by dedupe_key — one notification per (user, event, channel).
    const rows = await supabaseRest<Array<{ id: string }>>('notifications?on_conflict=dedupe_key', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({
        user_id: params.userId,
        event_id: params.eventId,
        channel: params.channel,
        status: params.send ? 'QUEUED' : 'SENT',
        reason: params.reason.slice(0, 500),
        dedupe_key: params.dedupeKey,
        sent_at: params.send ? null : new Date().toISOString(),
      }),
    });

    const rowId = rows[0]?.id;
    if (!rowId) {
      // Lost an insert race (ignore-duplicates suppressed representation).
      const raced = await supabaseRest<Array<{ id: string; status: string }>>(
        `notifications?dedupe_key=eq.${encodeURIComponent(params.dedupeKey)}&select=id,status&limit=1`,
        { method: 'GET' },
      );
      return raced[0] ? 'deduplicated' : 'failed';
    }

    if (params.send && rowId) {
      await supabaseRest(`notifications?id=eq.${rowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SENDING' }),
      }).catch(() => undefined);
      try {
        await params.send();
        await supabaseRest(`notifications?id=eq.${rowId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'SENT', sent_at: new Date().toISOString() }),
        });
        return 'created';
      } catch (err) {
        await supabaseRest(`notifications?id=eq.${rowId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'FAILED', error_message: (err as Error).message.slice(0, 500) }),
        });
        return 'failed';
      }
    }

    return 'created';
  } catch (err) {
    console.warn('recordNotification failed:', (err as Error).message);
    return 'failed';
  }
}
