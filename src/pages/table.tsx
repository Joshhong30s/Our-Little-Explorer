import { google } from 'googleapis'
import RawTable from '../components/rawTable'

type Table = {
  Day: string | Date
  Weight: number
  FeedingTime: string | Date
  FeedingVolume: number
  DiaperTime: string | Date
  DiaperColor: string
  Event: string
}

export async function getServerSideProps() {
  //auth
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  //query
  const range = 'baby!A1:G'
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  })

  console.log(response)

  //result
  const data =
    response.data.values
      ?.slice(1)
      .map((row) => {
        const [
          Day,
          Weight,
          FeedingTime,
          FeedingVolume,
          DiaperTime,
          DiaperColor,
          Event,
        ] = row
        return {
          Day,
          Weight,
          FeedingTime,
          FeedingVolume,
          DiaperTime,
          DiaperColor,
          Event: Event !== undefined ? Event : null,
        }
      })
      ?.reverse() ?? []

  return {
    props: {
      data,
    },
  }
}

export default function Table({ data }: { data: Table[] }) {
  return (
    <div>
      <RawTable data={data} />
    </div>
  )
}
