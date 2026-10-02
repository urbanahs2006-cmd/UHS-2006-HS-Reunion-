const SHEET_NAME = 'RSVPs';
const HEADERS = [
  'Submitted At',
  'First Name',
  'Last Name',
  'Name in High School',
  'Email',
  'Phone',
  'RSVP Status',
  'Friday Esquire',
  'Saturday School Tour',
  'Saturday Riggs',
  'Rose Bowl Tavern',
  'Guest Count',
  'Guest Names',
  'Current City/State',
  'Message',
  'Public Directory Opt-In',
  'Submission Source'
];

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (payload.action === 'contact') return saveContact_(payload);
    validatePayload_(payload);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getOrCreateSheet_();
      const row = toRow_(payload);
      const emailColumn = HEADERS.indexOf('Email') + 1;
      const existingRow = findEmailRow_(sheet, emailColumn, payload.email);

      if (existingRow) {
        sheet.getRange(existingRow, 1, 1, HEADERS.length).setValues([row]);
        return json_({ ok: true, updated: true });
      }

      sheet.appendRow(row);
      return json_({ ok: true, updated: false });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Unknown error' });
  }
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'health';
  if (action === 'reunionPhotos') return getReunionPhotos_();
  if (action === 'publicAttendees') return getPublicAttendees_();
  return json_({ ok: true, service: 'UHS 2006 RSVP' });
}

function getPublicAttendees_() {
  const sheet = getOrCreateSheet_();
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return json_({ ok: true, classmates: 0, guests: 0, total: 0, names: [] });

  const index = HEADERS.reduce((map, name, i) => (map[name] = i, map), {});
  let classmates = 0;
  let guests = 0;
  const names = [];

  rows.slice(1).forEach(row => {
    const status = String(row[index['RSVP Status']] || '').toLowerCase();
    if (status !== 'yes') return;

    classmates += 1;
    guests += Math.max(0, Number(row[index['Guest Count']]) || 0);

    const optedIn = String(row[index['Public Directory Opt-In']] || '').toLowerCase() === 'yes';
    if (optedIn) {
      const first = String(row[index['First Name']] || '').trim();
      const last = String(row[index['Last Name']] || '').trim();
      if (first || last) names.push([first, last].filter(Boolean).join(' '));
    }
  });

  names.sort((a, b) => a.localeCompare(b));
  return json_({ ok: true, classmates, guests, total: classmates + guests, names });
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#e84f0b')
      .setFontColor('#ffffff');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return sheet;
}

function findEmailRow_(sheet, emailColumn, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const emails = sheet.getRange(2, emailColumn, lastRow - 1, 1).getDisplayValues();
  const normalized = String(email || '').trim().toLowerCase();
  for (let i = 0; i < emails.length; i += 1) {
    if (String(emails[i][0]).trim().toLowerCase() === normalized) return i + 2;
  }
  return null;
}

function toRow_(payload) {
  return [
    new Date(),
    clean_(payload.firstName),
    clean_(payload.lastName),
    clean_(payload.formerName),
    clean_(payload.email).toLowerCase(),
    clean_(payload.phone),
    clean_(payload.rsvpStatus),
    yesNo_(payload.events && payload.events.fridayEsquire),
    yesNo_(payload.events && payload.events.schoolTour),
    yesNo_(payload.events && payload.events.saturdayRiggs),
    yesNo_(payload.events && payload.events.cowboyMonkey),
    Math.max(0, Number(payload.guestCount) || 0),
    clean_(payload.guestNames),
    clean_(payload.currentCity),
    clean_(payload.message),
    yesNo_(payload.directoryConsent),
    clean_(payload.submittedFrom)
  ];
}

function validatePayload_(payload) {
  if (!payload.firstName || !payload.lastName || !payload.email || !payload.rsvpStatus) {
    throw new Error('Missing required fields.');
  }
  if (!/^\S+@\S+\.\S+$/.test(String(payload.email))) {
    throw new Error('Invalid email address.');
  }
}

function clean_(value) {
  return String(value == null ? '' : value).trim();
}

function yesNo_(value) {
  return value ? 'Yes' : 'No';
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// Separate from the historical RSVP tab. Submissions are append-only so a public
// form cannot overwrite another classmate's existing contact details by email.
const CONTACT_HEADERS = ['Submitted At', 'First Name', 'Last Name', 'Email', 'Phone', 'Preferred Communication', '25-Year Reunion Interest', 'Planning Interest', 'Message', 'Contact Consent'];
const REUNION_PHOTO_FOLDER_ID = '1-9s5h-EYjN9P47uSJYYAf_ywtwehYsaQ';

function saveContact_(payload) {
  const fields = { firstName: 80, lastName: 80, email: 180, phone: 40, preferredCommunication: 20, reunionInterest: 10, planningInterest: 10, message: 1500 };
  Object.keys(fields).forEach(function(key) {
    if (payload[key] != null && typeof payload[key] !== 'string') throw new Error('Invalid contact field.');
    payload[key] = clean_(payload[key]);
    if (payload[key].length > fields[key]) throw new Error('Contact field too long.');
  });
  if (!payload.firstName || !payload.lastName || !/^\S+@\S+\.\S+$/.test(payload.email)) throw new Error('Name and valid email are required.');
  if (['email', 'text', 'phone'].indexOf(payload.preferredCommunication) < 0 || ['yes', 'maybe', 'no'].indexOf(payload.reunionInterest) < 0 || ['yes', 'maybe', 'no'].indexOf(payload.planningInterest) < 0) throw new Error('Invalid preferences.');
  if ((payload.phone || payload.preferredCommunication !== 'email') && payload.phone.replace(/\D/g, '').length < 7) throw new Error('Valid phone number required.');
  if (payload.consent !== true) throw new Error('Contact consent required.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Class Contacts');
    if (!sheet) sheet = spreadsheet.insertSheet('Class Contacts');
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, CONTACT_HEADERS.length).setValues([CONTACT_HEADERS]).setFontWeight('bold').setBackground('#e8571b').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    const values = [payload.firstName, payload.lastName, payload.email.toLowerCase(), payload.phone, payload.preferredCommunication, payload.reunionInterest, payload.planningInterest, payload.message, 'Yes'];
    // Force user-entered strings to remain text, including formula-like entries.
    sheet.appendRow([new Date()].concat(values.map(sheetText_)));
    return json_({ ok: true, saved: 'contact' });
  } finally { lock.releaseLock(); }
}

function sheetText_(value) {
  const text = String(value || '');
  return /^[=+@-]/.test(text) ? "'" + text : text;
}

function getReunionPhotos_() {
  try {
    const folder = DriveApp.getFolderById(REUNION_PHOTO_FOLDER_ID);
    const files = folder.getFiles();
    const photos = [];
    while (files.hasNext()) {
      const file = files.next();
      // Only publish browser-compatible images already available by link.
      // This does not change any Drive permissions or expose private images.
      if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].indexOf(file.getMimeType()) < 0) continue;
      const access = file.getSharingAccess();
      if (access !== DriveApp.Access.ANYONE && access !== DriveApp.Access.ANYONE_WITH_LINK) continue;
      photos.push({ id: file.getId(), sortName: file.getName() });
    }
    photos.sort(function(a, b) { return a.sortName.localeCompare(b.sortName, undefined, { numeric: true }); });
    return json_({ ok: true, photos: photos.map(function(photo) { return { id: photo.id }; }) });
  } catch (error) {
    return json_({ ok: false, error: 'Reunion photos are unavailable.' });
  }
}
