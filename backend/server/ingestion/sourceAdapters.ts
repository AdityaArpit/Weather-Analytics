import { searchGoogleNews } from '../googleNews';
import { getSachetAlerts } from '../sachet';

export type SourceType = 'OFFICIAL' | 'NEWS' | 'SOCIAL' | 'DATASET' | 'CITIZEN';

export interface RawObservation {
  sourceAdapterId: string;
  sourceType: SourceType;
  externalId: string;
  title: string;
  rawContent: string;
  rawPayload: unknown;
  sourceUrl?: string;
  publisher?: string;
  publishedAt?: string;
  retrievedAt: string;
  locationText?: string;
  eventCategory?: string;
  metadata?: Record<string, unknown>;
}

export interface SourceHealth {
  sourceAdapterId: string;
  status: 'OK' | 'DISABLED' | 'ERROR';
  message?: string;
  checkedAt: string;
}

export interface SourceAdapter {
  id: string;
  type: SourceType;
  fetchRecent(): Promise<RawObservation[]>;
  healthCheck(): Promise<SourceHealth>;
}

export class SachetCapAdapter implements SourceAdapter {
  id = 'sachet-cap';
  type: SourceType = 'OFFICIAL';

  async fetchRecent(): Promise<RawObservation[]> {
    if (process.env.SOURCE_SACHET_ENABLED === 'false') return [];
    const result = await getSachetAlerts();
    return result.alerts.map((alert) => ({
      sourceAdapterId: this.id,
      sourceType: this.type,
      externalId: alert.identifier,
      title: alert.headline || alert.event,
      rawContent: [alert.description, alert.instruction, alert.areaDesc].filter(Boolean).join('\n\n'),
      rawPayload: alert,
      sourceUrl: alert.webUrl || alert.officialPortalUrl,
      publisher: alert.sourceAgency || alert.sender || 'SACHET/CAP',
      publishedAt: alert.sent || alert.effective,
      retrievedAt: result.lastUpdated,
      locationText: alert.areaDesc,
      eventCategory: alert.category,
      metadata: { etag: result.etag, cacheStatus: result.cacheStatus },
    }));
  }

  async healthCheck(): Promise<SourceHealth> {
    if (process.env.SOURCE_SACHET_ENABLED === 'false') {
      return { sourceAdapterId: this.id, status: 'DISABLED', checkedAt: new Date().toISOString() };
    }
    return { sourceAdapterId: this.id, status: 'OK', checkedAt: new Date().toISOString() };
  }
}

export class GoogleNewsAdapter implements SourceAdapter {
  id = 'google-news-rss';
  type: SourceType = 'NEWS';

  constructor(private readonly query = 'India disaster weather alert') {}

  async fetchRecent(): Promise<RawObservation[]> {
    if (process.env.SOURCE_GOOGLE_NEWS_ENABLED === 'false') return [];
    const articles = await searchGoogleNews(this.query, { isCurrentNews: true, windowHours: 72, maxResults: 20 });
    const retrievedAt = new Date().toISOString();
    return articles.map((article) => ({
      sourceAdapterId: this.id,
      sourceType: this.type,
      externalId: article.id,
      title: article.title,
      rawContent: article.summary,
      rawPayload: article,
      sourceUrl: article.url,
      publisher: article.publisher,
      publishedAt: article.publishedAt,
      retrievedAt,
      eventCategory: undefined,
      metadata: { query: article.query || this.query, recencyVerified: article.recencyVerified },
    }));
  }

  async healthCheck(): Promise<SourceHealth> {
    if (process.env.SOURCE_GOOGLE_NEWS_ENABLED === 'false') {
      return { sourceAdapterId: this.id, status: 'DISABLED', checkedAt: new Date().toISOString() };
    }
    return { sourceAdapterId: this.id, status: 'OK', checkedAt: new Date().toISOString() };
  }
}

export function getConfiguredSourceAdapters(): SourceAdapter[] {
  return [
    new SachetCapAdapter(),
    new GoogleNewsAdapter(),
  ];
}
