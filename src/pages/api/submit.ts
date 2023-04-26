import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

type FormData = {
  avatar: string
  name: string
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  // pase the JSON string into an object
  const credentials = JSON.parse(credentialsJson)

  // create Google Auth Client
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  // query
  const range = 'message!A:D'
  const body: FormData = req.body
  const time = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei',
  }).format(new Date())

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[time, body.avatar, body.name, body.message]],
      },
    })

    console.log('Response data:', response.data)

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error appending data to GoogleSheet:', error)
    return new Response(JSON.stringify({ status: 'error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}
