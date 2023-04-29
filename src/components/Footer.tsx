import { FaGithub, FaLinkedin, FaLine, FaEnvelope } from 'react-icons/fa'

const isClient = typeof window !== 'undefined'
const isMobile = isClient
  ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  : false

const handleLineClick = () => {
  if (!isClient) return

  if (isMobile) {
    window.location.href = 'https://line.me/ti/p/0u5WhCBHF-'
  } else {
    window.open('https://line.me/ti/p/0u5WhCBHF-', '_blank')
  }
}

export default function Footer() {
  return (
    <footer className='bg-white mx-auto text-lg text-black px-6 py-2 items-center'>
      <div className='mx-auto p-4 flex flex-col text-center text-black-900 md:flex-row md:justify-between'>
        <div className='text-black mb-2 md:my-1 '>@ 2023 Josh Hong</div>
        <div className='flex flex-row items-center justify-center space-x-4 my-1'>
          <a
            href='https://github.com/Joshhong30s/06baby'
            rel='noreferrer'
            target='_blank'
          >
            <FaGithub
              className='hover:-translate-y-1 transition-transform cursor-pointer text-black-500 '
              size={30}
            />
          </a>
          <a
            href='https://www.linkedin.com/in/josh-hong-163644102/'
            rel='noreferrer'
            target='_blank'
          >
            <FaLinkedin
              className='hover:-translate-y-1 transition-transform cursor-pointer text-black-500 '
              size={30}
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
