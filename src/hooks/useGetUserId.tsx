// export const useGetUserID = () => {
//   return window.localStorage.getItem('userID')
// }
import { useState, useEffect } from 'react'

export const useGetUserID = () => {
  const [userID, setUserID] = useState<string | null>(null)

  useEffect(() => {
    const id = window.localStorage.getItem('userID')
    setUserID(id)
  }, [])

  return userID
}
