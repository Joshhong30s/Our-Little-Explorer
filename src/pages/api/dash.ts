import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // check if base64 settled
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64) {
    throw new Error(
      'GOOGLE APPLICATION CREDENTIALS JSON BASE64 is not set in env variables'
    )
  }

  // decode base64 string
  const credentialsJson = Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64,
    'base64'
  ).toString()

  // parse the JSON string into an object
  const credentials = JSON.parse(credentialsJson)

  // create Google Auth Client
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  // query
  const range = 'daily!A1:CB'

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    })

    console.log('Response data:', response.data)

    res.status(200).json({ status: 'success' })
  } catch (error) {
    console.error('Error getting data from GoogleSheet:', error)
    return new Response(JSON.stringify({ status: 'error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

export default handler
