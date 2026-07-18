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
  'Cowboy Monkey',
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
