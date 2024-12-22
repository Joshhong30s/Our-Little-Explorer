import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64) {
    return res.status(500).json({
      status: 'error',
      message: 'GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 is not set',
    });
  }

  const credentialsJson = Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64,
    'base64'
  ).toString();

  const credentials = JSON.parse(credentialsJson);

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'message!A:D';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    const rows = response.data.values || [];
    console.log('Raw rows from Google Sheets:', rows);

    const messages = rows.slice(1).map(row => ({
      date: row[0] || '',
      avatar: row[1] || '',
      name: row[2] || '',
      message: row[3] || '',
    }));

    console.log('Formatted messages:', messages);

    res.status(200).json({ status: 'success', messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages',
    });
  }
}

export default handler;
