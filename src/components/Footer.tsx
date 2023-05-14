import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className='bg-white mx-auto text-lg text-black px-6 py-2 items-center'>
      <div className='mx-auto p-4 flex text-black-900 justify-between md:justify-around'>
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
