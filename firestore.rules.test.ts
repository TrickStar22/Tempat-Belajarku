import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesContent = fs.readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8');

test('firestore.rules includes global default-deny catch-all and rules_version 2', () => {
  assert.match(rulesContent, /rules_version = '2';/);
  assert.match(rulesContent, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);
});

test('firestore.rules enforces verified ownership, path ID validation, and timestamp integrity', () => {
  assert.match(rulesContent, /request\.auth\.token\.email_verified == true/);
  assert.match(rulesContent, /function isValidId\(id\)/);
  assert.match(rulesContent, /incoming\(\)\.createdAt == request\.time/);
  assert.match(rulesContent, /incoming\(\)\.updatedAt == request\.time/);
});

test('firestore.rules isolates PII and locks transactions against update/delete', () => {
  assert.match(rulesContent, /match \/private\/\{docId\}/);
  assert.match(rulesContent, /match \/transactions\/\{transactionId\}/);
  assert.match(rulesContent, /allow update, delete: if false;/);
  assert.doesNotMatch(rulesContent, /allow list:[^;]*?(get|exists)\(/);
});
