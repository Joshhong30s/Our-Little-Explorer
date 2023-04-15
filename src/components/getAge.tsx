export default function getAge(birthday: string, cookingTime: string): string {
  const oneDay: number = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
  const birthDate: Date = new Date(birthday)
  const endDate: Date = new Date(cookingTime)
  const diffDays: number = Math.round(
    Math.abs((endDate.getTime() - birthDate.getTime()) / oneDay)
  )
  const years: number = Math.floor(diffDays / 365)
  const months: number = Math.floor((diffDays % 365) / 30)
  const days: number = Math.floor((diffDays % 365) % 30)

  return `${years} years\n ${months} months\n ${days} days`
}
