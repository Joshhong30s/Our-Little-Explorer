import { useState, useEffect } from 'react'

type TimerProps = {
  birthday: string
}

const Timer = ({ birthday }: TimerProps) => {
  const [years, setYears] = useState(0)
  const [months, setMonths] = useState(0)
  const [days, setDays] = useState(0)

  useEffect(() => {
    const timeDiff = new Date().getTime() - new Date(birthday).getTime()
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const years = Math.floor(totalDays / 365)
    const months = Math.floor((totalDays % 365) / 30)
    const days = ((totalDays % 365) % 30) % 7

    setYears(years)
    setMonths(months)
    setDays(days)
  }, [birthday])

  return (
    <p className=' text-gray-800 text-sm'>
      {years} years {months} months {days} days
    </p>
  )
}

export default Timer
