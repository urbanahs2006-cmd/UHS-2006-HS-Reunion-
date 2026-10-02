import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { validateContact } from '../lib/contact.mjs';
const valid = { firstName: ' Test ', lastName: 'Classmate', email: 'TEST@example.com', phone: '', preferredCommunication: 'email', reunionInterest: 'maybe', planningInterest: 'no', message: '', consent: true };
test('contact normalization and required preferences', () => {
  assert.equal(validateContact(valid).email, 'test@example.com');
  assert.equal(validateContact(valid).firstName, 'Test');
  for (const patch of [{ email: 'invalid' }, { consent: false }, { reunionInterest: 'invalid' }, { preferredCommunication: 'text' }, { preferredCommunication: 'phone' }, { firstName: [] }, { message: 'x'.repeat(1501) }]) assert.throws(() => validateContact({ ...valid, ...patch }));
  assert.equal(validateContact({ ...valid, phone: '(217) 555-0100', preferredCommunication: 'text' }).preferredCommunication, 'text');
});
test('Apps Script stores contact rows separately, escapes formulas and acknowledges saves', () => {
  const sheets = new Map();
  function sheet() {
    return { rows: [], getLastRow() { return this.rows.length; }, setFrozenRows() {}, getRange() { const self = this; return { setValues(rows) { self.rows.push(...rows); return this; }, setFontWeight() { return this; }, setBackground() { return this; }, setFontColor() { return this; } }; }, appendRow(row) { this.rows.push(row); } };
  }
  const rsvps = sheet(); rsvps.rows = [['historical RSVP']]; sheets.set('RSVPs', rsvps);
  const context = vm.createContext({ SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: name => sheets.get(name), insertSheet: name => { const result = sheet(); sheets.set(name, result); return result; } }) }, LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ setMimeType: () => JSON.parse(value) }) } });
  vm.runInContext(fs.readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8'), context);
  const post = payload => context.doPost({ postData: { contents: JSON.stringify(payload) } });
  const payload = validateContact({ ...valid, firstName: '=1+1', phone: '+12175550100' });
  assert.equal(post(payload).saved, 'contact');
  assert.equal(sheets.get('Class Contacts').rows[1][1], "'=1+1");
  assert.equal(sheets.get('Class Contacts').rows[1][4], "'+12175550100");
  assert.equal(post(payload).saved, 'contact');
  assert.equal(sheets.get('Class Contacts').rows.length, 3);
  assert.deepEqual(rsvps.rows, [['historical RSVP']]);
  assert.equal(post({ ...payload, consent: false }).ok, false);
});
test('album excludes private files and unsupported formats, and sorts naturally', () => {
  const data = [{ id: 'b', name: 'UHS10.jpg', mime: 'image/jpeg', access: 'link' }, { id: 'a', name: 'UHS2.jpg', mime: 'image/jpeg', access: 'public' }, { id: 'private', name: 'private.jpg', mime: 'image/jpeg', access: 'private' }, { id: 'heic', name: 'image.heic', mime: 'image/heic', access: 'link' }];
  const context = vm.createContext({ DriveApp: { Access: { ANYONE: 'public', ANYONE_WITH_LINK: 'link' }, getFolderById: () => { let i = 0; return { getFiles: () => ({ hasNext: () => i < data.length, next: () => { const file = data[i++]; return { getId: () => file.id, getName: () => file.name, getMimeType: () => file.mime, getSharingAccess: () => file.access }; } }) }; } }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ setMimeType: () => JSON.parse(value) }) } });
  vm.runInContext(fs.readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8'), context);
  assert.deepEqual(context.doGet({ parameter: { action: 'reunionPhotos' } }).photos, [{ id: 'a' }, { id: 'b' }]);
});
