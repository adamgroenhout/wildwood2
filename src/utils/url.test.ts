import { test } from 'node:test';
import assert from 'node:assert';
import { formatUrl } from './url.ts';

test('formatUrl handles empty or null input', () => {
  assert.strictEqual(formatUrl(''), '');
  // @ts-ignore
  assert.strictEqual(formatUrl(null), null);
});

test('formatUrl handles anchors', () => {
  assert.strictEqual(formatUrl('#contact'), '#contact');
});

test('formatUrl handles external links', () => {
  assert.strictEqual(formatUrl('https://google.com'), 'https://google.com');
  assert.strictEqual(formatUrl('http://example.com'), 'http://example.com');
});

test('formatUrl handles special link schemes', () => {
  assert.strictEqual(formatUrl('mailto:test@example.com'), 'mailto:test@example.com');
  assert.strictEqual(formatUrl('tel:1234567890'), 'tel:1234567890');
});

test('formatUrl formats relative paths with base', () => {
  assert.strictEqual(formatUrl('about', '/base/'), '/base/about');
  assert.strictEqual(formatUrl('/about', '/base/'), '/base/about');
});

test('formatUrl handles base without trailing slash', () => {
  assert.strictEqual(formatUrl('about', '/base'), '/base/about');
  assert.strictEqual(formatUrl('/about', '/base'), '/base/about');
});

test('formatUrl does not double format if base is already present', () => {
  assert.strictEqual(formatUrl('/base/about', '/base/'), '/base/about');
  assert.strictEqual(formatUrl('/base/about', '/base'), '/base/about');
  assert.strictEqual(formatUrl('/base', '/base'), '/base');
});

test('formatUrl handles root base', () => {
  assert.strictEqual(formatUrl('about', '/'), '/about');
  assert.strictEqual(formatUrl('/about', '/'), '/about');
});
