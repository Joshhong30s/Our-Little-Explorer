import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64) {
    throw new Error(
      'GOOGLE APPLICATION CREDENTIALS JSON BASE64 is not set in env variables'
    );
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

  const range = 'daily!A1:CB';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    console.log('Response data:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting data from GoogleSheet:', error);
    return new Response(JSON.stringify({ status: 'error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export default handler;
