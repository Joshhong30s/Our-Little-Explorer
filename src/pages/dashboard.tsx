import Head from 'next/head'
import { google } from 'googleapis'
import { GiWeightScale, GiBodyHeight, GiAges } from 'react-icons/gi'

type Daily = {
  Day: string
  Weight: number
  Poopcolor: string
  Note: string
  '12AM': {
    feed: number
    pee: number
    poop: number
  }
  '1AM': {
    feed: number
    pee: number
    poop: number
  }
  '2AM': {
    feed: number
    pee: number
    poop: number
  }
  '3AM': {
    feed: number
    pee: number
    poop: number
  }
  '4AM': {
    feed: number
    pee: number
    poop: number
  }
  '5AM': {
    feed: number
    pee: number
    poop: number
  }
  '6AM': {
    feed: number
    pee: number
    poop: number
  }
  '7AM': {
    feed: number
    pee: number
    poop: number
  }
  '8AM': {
    feed: number
    pee: number
    poop: number
  }
  '9AM': {
    feed: number
    pee: number
    poop: number
  }
  '10AM': {
    feed: number
    pee: number
    poop: number
  }
  '11AM': {
    feed: number
    pee: number
    poop: number
  }
  '12PM': {
    feed: number
    pee: number
    poop: number
  }
  '1PM': {
    feed: number
    pee: number
    poop: number
  }
  '2PM': {
    feed: number
    pee: number
    poop: number
  }
  '3PM': {
    feed: number
    pee: number
    poop: number
  }
  '4PM': {
    feed: number
    pee: number
    poop: number
  }
  '5PM': {
    feed: number
    pee: number
    poop: number
  }
  '6PM': {
    feed: number
    pee: number
    poop: number
  }
  '7PM': {
    feed: number
    pee: number
    poop: number
  }
  '8PM': {
    feed: number
    pee: number
    poop: number
  }
  '9PM': {
    feed: number
    pee: number
    poop: number
  }
  '10PM': {
    feed: number
    pee: number
    poop: number
  }
  '11PM': {
    feed: number
    pee: number
    poop: number
  }
  Total: {
    feed: number
    pee: number
    poop: number
  }
}

export async function getServerSideProps() {
  // check if base64 settled
  if (!process.env.NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64) {
    throw new Error(
      'NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 is not set in env variables'
    )
  }

  // // decode base64 string
  const credentialsJson = Buffer.from(
    process.env.NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64,
    'base64'
  ).toString()

  // pase the JSON string into an object
  const credentials = JSON.parse(credentialsJson)

  // create Google Auth Client
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  //query
  const range = 'daily!A1:CA'
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  })

  console.log(response)

  const hours = [
    '12AM',
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
  ]

  //result
  const data =
    response.data.values
      ?.slice(2)
      .map((row: any[]) => {
        const obj: any = {
          Day: row[0],
          Weight: Number(row[1]),
          Poopcolor: row[2],
          Note: row[3],
        }

        hours.forEach((hour, index) => {
          obj[hour] = {
            feed: Number(row[4 + index * 3]),
            pee: Number(row[5 + index * 3]),
            poop: Number(row[6 + index * 3]),
          }
        })

        return obj
      })
      ?.reverse() ?? []

  console.log('data', data)

  return {
    props: {
      data,
    },
  }
}

export default function Dashboard({ data }: { data: Daily[] }) {
  const latestWeightEntry = data.find((entry) => entry.Weight)
  const weight = latestWeightEntry
    ? latestWeightEntry.Weight
    : 'No data available'

  return (
    <div className='container mx-auto p-4'>
      <Head>
        <title>Baby Health Tracker</title>
        <meta name='description' content='A baby health tracking dashboard' />
      </Head>

      <div className='flex flex-col md:flex-row  h-[80vh]'>
        <div className='md:w-1/3 flex flex-col md:pl-4'>
          <div className='flex-1 bg-yellow-200 p-4 rounded-md mb-4'>
            {/* Avatar and infocards */}
            <div className='card bg-white shadow-md rounded p-4 mb-4'>
              <h2 className='text-lg font-semibold mb-2'>Avatar</h2>
            </div>
            <div className='flex justify-between gap-4'>
              <div className='card bg-white shadow-md rounded p-4 w-1/3'>
                <GiWeightScale size={20} />
                <p>Age</p>
                <p>g</p>
              </div>
              <div className='card bg-white shadow-md rounded p-4 w-1/3'>
                <GiWeightScale size={20} />
                <p>Age</p>
                <p>{weight}kg</p>
              </div>
              <div className='card bg-white shadow-md rounded p-4 w-1/3'>
                <h2 className='text-lg font-semibold mb-2'>Info Card 3</h2>
              </div>
            </div>
          </div>
          <div className='flex-1 bg-purple-200 p-4 rounded-md'>
            {/* Calendar */}
            <div className='card bg-white shadow-md rounded p-4'>
              <h2 className='text-lg font-semibold mb-2'>Calendar</h2>
            </div>
          </div>
        </div>

        <div className='md:w-2/3 flex flex-col md:pr-4'>
          <div className='flex-1 flex justify-between gap-4 bg-blue-200 p-4 rounded-md mb-4'>
            {/* Health cards */}
            <div className='card bg-white shadow-md rounded p-4 w-1/3'>
              <h2 className='text-lg font-semibold mb-2'>Health Card 1</h2>
            </div>
            <div className='card bg-white shadow-md rounded p-4 w-1/3'>
              <h2 className='text-lg font-semibold mb-2'>Health Card 2</h2>
            </div>
            <div className='card bg-white shadow-md rounded p-4 w-1/3'>
              <h2 className='text-lg font-semibold mb-2'>Health Card 3</h2>
            </div>
          </div>
          <div className='flex-1 bg-green-200 p-4 rounded-md mb-4'>
            {/* Simple card */}
            <div className='card bg-white shadow-md rounded p-4'>
              <h2 className='text-lg font-semibold mb-2'>Simple Card</h2>
            </div>
          </div>
          <div className='flex-1 bg-red-200 p-4 rounded-md'>
            {/* Chart */}
            <div className='card bg-white shadow-md rounded p-4'>
              <h2 className='text-lg font-semibold mb-2'>Chart</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
