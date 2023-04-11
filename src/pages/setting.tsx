import Link from 'next/link'

export default function Setting() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <h1>Coming Soon!</h1>
        <p>This page is currently under construction.</p>
        <p>Please check back later for updates.</p>
      </div>
      <Link href='/' className='mt-10 border-4 bg-orange-950'>
        Go back to Home Page
      </Link>
    </div>
  )
}
