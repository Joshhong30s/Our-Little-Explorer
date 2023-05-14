import Head from 'next/head'
import { useState, useEffect } from 'react'
import { google } from 'googleapis'
import { GiWeightScale, GiBodyHeight, GiAges } from 'react-icons/gi'
import { FaTint, FaPoop } from 'react-icons/fa'
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import React from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'

type Daily = {
  Day: string
  Weight: number
  Height: number
  Poopcolor: string
  Note: string
  [hour: string]: any
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
  TotalFeed: number
  TotalPee: number
  TotalPoop: number
}

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
  const range = 'daily!A1:CB'
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  })

  console.log(response)

  //result
  const data =
    response.data.values
      ?.slice(2)
      .map((row: any[]) => {
        const obj: any = {
          Day: row[0],
          Weight: Number(row[1]),
          Height: Number(row[2]),
          Poopcolor: row[3],
          Note: row[4],
        }

        hours.forEach((hour, index) => {
          obj[hour] = {
            feed: Number(row[5 + index * 3]),
            pee: Number(row[6 + index * 3]),
            poop: Number(row[7 + index * 3]),
          }
        })

        // Add total feed, pee, and poop values
        obj.TotalFeed = Number(row[row.length - 3])
        obj.TotalPee = Number(row[row.length - 2])
        obj.TotalPoop = Number(row[row.length - 1])

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
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (data) {
      setIsLoading(false) // Set loading to false when data is ready
    }
  }, [data])

  const latestData = data[0]
  const [selected, setSelected] = useState<Date | undefined>(
    latestData ? new Date(latestData.Day) : undefined
  )
  const [dailyData, setDailyData] = useState<Daily | null>(latestData || null)

  useEffect(() => {
    if (selected) {
      const foundData = data.find(
        (d) => new Date(d.Day).toDateString() === selected.toDateString()
      )
      if (foundData) {
        setDailyData(foundData)
      } else {
        setDailyData(null)
      }
    }
  }, [selected, data])

  const handleSelect: SelectSingleEventHandler = (date) => {
    setSelected(date)
  }

  // Get today's date
  const today = new Date()
  // Get baby's birthdate
  const birthdate = new Date('2023-04-12')

  // Calculate difference in months
  const months =
    (today.getFullYear() - birthdate.getFullYear()) * 12 +
    today.getMonth() -
    birthdate.getMonth()

  // Get weight
  const latestWeightEntry = data.find((entry) => entry.Weight)
  const weight = latestWeightEntry
    ? latestWeightEntry.Weight
    : 'No data available'

  const latestHeightEntry = data.find((entry) => entry.Height)
  const height = latestHeightEntry
    ? latestHeightEntry.Height
    : 'No data available'

  const latestEntry = data[0]

  const note = dailyData?.Note ?? 'No data available'

  const feed = dailyData?.TotalFeed ?? 'No data available'

  const pee = dailyData?.TotalPee ?? 'No data available'

  const poop = dailyData?.TotalPoop ?? 'No data available'

  const feedByHour = () => {
    if (!dailyData) {
      return []
    }

    return hours.map((hour: string, index: number) => {
      if (hour in dailyData && dailyData[hour]?.feed > 0) {
        return {
          hour: hour,
          index: 1,
          value: dailyData[hour]?.feed,
        }
      } else {
        return {
          hour: hour,
          index: 1,
          value: null,
        }
      }
    })
  }

  const peeByHour = () => {
    if (!dailyData) {
      return []
    }

    return hours.map((hour: string, index: number) => {
      if (hour in dailyData && dailyData[hour]?.pee > 0) {
        return {
          hour: hour,
          index: 1,
          value: dailyData[hour]?.pee,
        }
      } else {
        return {
          hour: hour,
          index: 1,
          value: null,
        }
      }
    })
  }

  const poopByHour = () => {
    if (!dailyData) {
      return []
    }

    return hours.map((hour: string, index: number) => {
      if (hour in dailyData && dailyData[hour]?.poop > 0) {
        return {
          hour: hour,
          index: 1,
          value: dailyData[hour]?.poop,
        }
      } else {
        return {
          hour: hour,
          index: 1,
          value: null,
        }
      }
    })
  }

  const parseDomain = () => [
    0,
    Math.max(
      ...feedByHour().map((entry: any) => entry.value),
      ...peeByHour().map((entry: any) => entry.value),
      ...poopByHour().map((entry: any) => entry.value)
    ),
  ]

  const renderTooltip = (props: any) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload

      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #999',
            margin: 0,
            padding: 10,
          }}
        >
          <p>{data.hour}</p>
          <p>
            <span>value: </span>
            {data.value}
          </p>
        </div>
      )
    }
    return null
  }

  const domain = parseDomain()
  const range = [0, 300]
  const range2 = [100, 250]

  if (isLoading) {
    // This will be shown while the data is loading
    return (
      <div className='container mx-auto p-4'>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4'>
      <Head>
        <title>Baby Health Tracker</title>
        <meta name='description' content='A baby health tracking dashboard' />
      </Head>

      <div className='flex flex-col md:flex-row min-h-screen'>
        <div className='md:w-1/3 flex flex-col md:pr-4'>
          <div className='flex-1 bg-yellow-200 p-4 rounded-md mb-4 flex flex-col justify-center items-center'>
            {/* Avatar and infocards */}
            <div className='card bg-white shadow-md rounded p-4 mb-4 flex flex-col justify-start items-center'>
              <Image
                src='/avatar.jpg'
                alt='avatar.jpg'
                width={100}
                height={100}
                className='mb-4 rounded-2xl'
              />
              <p className='text-center'>小寶</p>
            </div>

            <div className='flex justify-between gap-4'>
              <div className='card bg-white shadow-md rounded p-4 w-1/3 text-center flex flex-col justify-center items-center'>
                <GiAges size={40} className='mb-2' />
                <p>Age</p>
                <p>{months}M</p>
              </div>

              <div className='card bg-white shadow-md rounded p-4 w-1/3 text-center flex flex-col justify-center items-center'>
                <GiWeightScale size={40} className='mb-2' />
                <p>Weight</p>
                <p>{weight}g</p>
              </div>
              <div className='card bg-white shadow-md rounded p-4 w-1/3 text-center flex flex-col justify-center items-center'>
                <GiBodyHeight size={40} className='mb-2' />
                <p>Height</p>
                <p>{height}cm</p>
              </div>
            </div>
          </div>
          <div className='flex-1 bg-purple-200 p-4 rounded-md'>
            {/* Calendar */}
            <div className='card bg-white shadow-md rounded p-4 flex justify-center items-center'>
              <DayPicker
                mode='single'
                selected={selected || undefined}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>

        <div className='md:w-2/3 flex flex-col md:pl-4'>
          <div className='flex-1 flex justify-between gap-4 bg-blue-200 p-4 rounded-md mb-4'>
            {/* Health cards */}
            <div className='card bg-white shadow-md rounded p-4 w-1/3 flex flex-col justify-center items-center space-y-2'>
              <img
                src='/feed.svg'
                width={60}
                height={60}
                className='mb-2 mx-auto'
              />
              <h2 className='text-lg font-semibold mb-2'>Total Feed</h2>
              <p>{dailyData ? feed : 'N/A'}</p>
            </div>
            <div className='card bg-white shadow-md rounded p-4 w-1/3 flex flex-col justify-center items-center space-y-2'>
              <FaTint size={50} className='mb-2 mx-auto' />
              <h2 className='text-lg font-semibold mb-2'>Total Pee</h2>
              <p>{dailyData ? pee + ' times' : 'N/A'}</p>
            </div>
            <div className='card bg-white shadow-md rounded p-4 w-1/3 flex flex-col justify-center items-center space-y-2'>
              <FaPoop size={50} className='mb-2 mx-auto' />
              <h2 className='text-lg font-semibold mb-2'>Total Poop</h2>
              <p>{dailyData ? poop + ' times' : 'N/A'}</p>
            </div>
          </div>

          <div className='flex-1 bg-green-200 p-4 rounded-md mb-4'>
            {/* Simple card */}
            <div className='card bg-white shadow-md rounded p-2 text-center'>
              <h2 className='text-lg font-semibold mb-2'>本日記事</h2>
              <h5 className='text-lg font-medium mb-1 text-gray-600'>
                {dailyData ? note : 'No Note Today'}
              </h5>
            </div>
          </div>

          <div className='flex-1 bg-red-200 p-4 rounded-md'>
            {/* Chart */}
            <div className='card bg-white shadow-md rounded p-4 py-6'>
              {' '}
              <ResponsiveContainer width='100%' height={60}>
                <ScatterChart
                  width={820}
                  height={60}
                  margin={{
                    top: 10,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <XAxis
                    type='category'
                    dataKey='hour'
                    name='hour'
                    interval={0}
                    tick={{ fontSize: 10 }}
                    tickLine={{ transform: 'translate(0, -6)' }}
                  />
                  <YAxis
                    type='number'
                    dataKey='index'
                    name='奶量'
                    height={10}
                    width={80}
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: '奶量', position: 'insideCenter' }}
                  />
                  <ZAxis
                    type='number'
                    dataKey='value'
                    domain={domain}
                    range={range}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    wrapperStyle={{ zIndex: 100 }}
                    content={renderTooltip}
                  />
                  <Scatter data={feedByHour()} fill='#8884d8' />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className='card bg-white shadow-md rounded p-4'>
              <ResponsiveContainer width='100%' height={60}>
                <ScatterChart
                  width={820}
                  height={60}
                  margin={{
                    top: 10,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <XAxis
                    type='category'
                    dataKey='hour'
                    name='pee'
                    interval={0}
                    tick={{ fontSize: 10 }}
                    tickLine={{ transform: 'translate(0, -6)' }}
                  />
                  <YAxis
                    type='number'
                    dataKey='index'
                    name='小便'
                    height={10}
                    width={80}
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: '小便', position: 'insideCenter' }}
                  />
                  <ZAxis
                    type='number'
                    dataKey='value'
                    domain={domain}
                    range={range2}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    wrapperStyle={{ zIndex: 100 }}
                    content={renderTooltip}
                  />
                  <Scatter data={peeByHour()} fill='#8884d8' />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className='card bg-white shadow-md rounded p-4'>
              <ResponsiveContainer width='100%' height={60}>
                <ScatterChart
                  width={820}
                  height={60}
                  margin={{
                    top: 10,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <XAxis
                    type='category'
                    dataKey='hour'
                    name='poop'
                    interval={0}
                    tick={{ fontSize: 10 }}
                    tickLine={{ transform: 'translate(0, -6)' }}
                  />
                  <YAxis
                    type='number'
                    dataKey='index'
                    name='大便'
                    height={10}
                    width={80}
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: '大便', position: 'insideCenter' }}
                  />
                  <ZAxis
                    type='number'
                    dataKey='value'
                    domain={domain}
                    range={range2}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    wrapperStyle={{ zIndex: 100 }}
                    content={renderTooltip}
                  />
                  <Scatter data={poopByHour()} fill='#8884d8' />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
