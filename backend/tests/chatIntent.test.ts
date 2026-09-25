import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyChatIntent } from '../server/lib/chatIntent.ts';

// ---------------------------------------------------------------------------
// Spec sections 5 & 8: intent routing. Generic questions must NEVER fall
// through to the disaster-database pipeline (the "Who are you? -> No data
// found" bug); disaster queries must stay on the evidence path.
// ---------------------------------------------------------------------------

test('generic identity questions are answered without database retrieval', () => {
  for (const message of ['Who are you?', 'what are you', 'Tell me about yourself']) {
    const decision = classifyChatIntent(message);
    assert.equal(decision.intent, 'GENERIC', `"${message}" should be GENERIC`);
    assert.ok(decision.genericReply && decision.genericReply.length > 40);
    assert.match(decision.genericReply!, /Aapda Drishti/i);
  }
});

test('capability and platform questions route to the generic capability layer', () => {
  for (const message of [
    'What can you do?',
    'How do I use this system?',
    'What is this platform?',
    'What does the Present layer mean?',
    'What does the Past layer do?',
    'What does the Future layer do?',
    'How are citizen reports verified?',
  ]) {
    const decision = classifyChatIntent(message);
    assert.equal(decision.intent, 'GENERIC', `"${message}" should be GENERIC`);
    assert.ok(decision.genericReply);
  }
});

test('conversational greetings stay generic', () => {
  assert.equal(classifyChatIntent('hi').intent, 'GENERIC');
  assert.equal(classifyChatIntent('hello!').intent, 'GENERIC');
  assert.equal(classifyChatIntent('thanks').intent, 'GENERIC');
});

test('generic replies never claim external facts or fabricate citations', () => {
  const decision = classifyChatIntent('Who are you?');
  const reply = decision.genericReply!;
  assert.ok(!/\[\d+\]|\[S\d+\]/.test(reply), 'generic replies must not contain citations');
});

test('disaster questions remain on the evidence path (no static answer)', () => {
  for (const message of [
    'What happened during Cyclone Amphan?',
    'floods in Assam last week',
    'earthquake casualties in 2015 Nepal border',
    'What was the death toll in the 2018 Kerala floods?',
  ]) {
    const decision = classifyChatIntent(message);
    assert.equal(decision.intent, 'DISASTER_QUERY', `"${message}" should reach retrieval`);
    assert.equal(decision.genericReply, undefined);
  }
});

test('follow-up phrasing on an open dossier stays in context', () => {
  const decision = classifyChatIntent('more details please', { hasAssociatedBundle: true });
  assert.equal(decision.intent, 'FOLLOW_UP');
});

test('short non-disaster messages are treated as conversational, not research', () => {
  assert.equal(classifyChatIntent('ok').intent, 'GENERIC');
  assert.equal(classifyChatIntent('really??').intent, 'GENERIC');
});
