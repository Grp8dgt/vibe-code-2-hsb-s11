'use strict';
const { google } = require('googleapis');

const SPREADSHEET_ID = '1V0Os-5oE90-G1A3Do1MUBiwNtFoi1HEGHISdsHs8W3s';

function formatDate(iso) {
  const d   = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GOOGLE_CREDENTIALS) {
    return res.status(500).json({ error: 'GOOGLE_CREDENTIALS env var not set' });
  }

  try {
    const entry       = req.body;
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    // Vercel env vars double-escape \n in private keys — repair before auth
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    // DEBUG: verify which service account is being used (remove after fix confirmed)
    if (!credentials.client_email) {
      return res.status(500).json({ error: 'credentials missing client_email', keys: Object.keys(credentials) });
    }
    return res.status(500).json({ debug_client_email: credentials.client_email, private_key_starts: credentials.private_key.slice(0,40) });

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Get first sheet tab name
    const { data } = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const tabName   = data.sheets[0].properties.title;

    // Append one row
    await sheets.spreadsheets.values.append({
      spreadsheetId:   SPREADSHEET_ID,
      range:           `${tabName}!A:E`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          formatDate(entry.timestamp),
          entry.location || '',
          entry.rating,
          entry.name     || '',
          entry.comment  || '',
        ]],
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
