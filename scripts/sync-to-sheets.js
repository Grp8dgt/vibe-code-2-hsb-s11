'use strict';
const fs    = require('fs');
const path  = require('path');
const { google }           = require('googleapis');
const { initializeApp }    = require('firebase-admin/app');
const { getFirestore }     = require('firebase-admin/firestore');
const { cert }             = require('firebase-admin/app');

// ── Config ────────────────────────────────────────────────────
const SPREADSHEET_ID = '1V0Os-5oE90-G1A3Do1MUBiwNtFoi1HEGHISdsHs8W3s';
const SHEET_TAB      = 'Sheet1';
const CREDS_PATH     = path.resolve(__dirname, '..', 'credentials.json');

// ── Load credentials (env var for CI, file for local) ─────────
let credentials;
if (process.env.GOOGLE_CREDENTIALS) {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} else if (fs.existsSync(CREDS_PATH)) {
  credentials = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
} else {
  console.error('✗  No credentials found.');
  console.error('   Local: add credentials.json to project root');
  console.error('   CI:    set GOOGLE_CREDENTIALS secret in GitHub');
  process.exit(1);
}

// ── Firebase Admin (Firestore read) ───────────────────────────
initializeApp({ credential: cert(credentials) });
const db = getFirestore();

// ── Google Sheets (write) ─────────────────────────────────────
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// ── Helpers ───────────────────────────────────────────────────
function formatDate(iso) {
  const d   = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Main sync ─────────────────────────────────────────────────
async function sync() {
  // 1. Read Firestore
  console.log('Đang tải dữ liệu từ Firestore...');
  const snap = await db.collection('feedbackEntries')
    .orderBy('timestamp', 'desc')
    .get();

  const rows = snap.docs.map(doc => {
    const e = doc.data();
    return [
      formatDate(e.timestamp),
      e.location  || '',
      e.rating,
      e.name      || '',
      e.comment   || '',
    ];
  });
  console.log(`  → ${rows.length} phản hồi`);

  // 2. Detect actual sheet tab name
  const { data: { sheets: sheetList } } = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const firstSheet = sheetList[0].properties;
  const tabName    = firstSheet.title;
  const sheetId    = firstSheet.sheetId;
  console.log(`  → Tab: "${tabName}"`);

  // 3. Clear old data
  console.log('Đang ghi vào Google Sheets...');
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A:Z`,
  });

  // 4. Write headers + rows
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        ['Ngày', 'Địa điểm', 'Đánh giá (★)', 'Tên', 'Nhận xét'],
        ...rows,
      ],
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.06, green: 0.35, blue: 0.78 } } },
            fields: 'userEnteredFormat(textFormat,backgroundColor)',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 5 },
          },
        },
      ],
    },
  });

  console.log(`✓ Xong — ${rows.length} hàng đã đồng bộ lên Google Sheets`);
  process.exit(0);
}

sync().catch(err => {
  console.error('✗ Lỗi:', err.message);
  if (err.message.includes('PERMISSION_DENIED') || err.message.includes('UNAUTHENTICATED')) {
    console.error('\n  Hướng dẫn sửa:');
    console.error('  1. Vào Firebase Console → Project Settings → Service Accounts → Generate new private key');
    console.error('  2. Lưu file tải về là credentials.json ở thư mục gốc dự án');
    console.error('  3. Chia sẻ Google Sheet với email trong credentials.json (trường "client_email")');
  }
  process.exit(1);
});
