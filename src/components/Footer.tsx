import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className='bg-gray-100 mx-auto text-lg  px-6 py-4 items-center'>
      <div className='mx-auto flex flex-col justify-center items-center md:max-w-full '>
        <div className='text-black font-medium mb-2 md:my-1 text-center flex justify-center items-center'>
          © 2023 Josh Hong
          <a
            href='https://github.com/Joshhong30s/06baby'
            rel='noreferrer'
            target='_blank'
          >
            <FaGithub
              className='hover:-translate-y-1 transition-transform cursor-pointer text-black-500 ml-4 '
              size={30}
            />
          </a>
          <a
            href='https://www.linkedin.com/in/josh-hong-163644102/'
            rel='noreferrer'
            target='_blank'
          >
            <FaLinkedin
              className='hover:-translate-y-1 transition-transform cursor-pointer text-black-500 ml-2'
              size={30}
            />
          </a>
        </div>
        <div className='flex flex-row items-center justify-center space-x-4 my-1'>
          <p className=' font-medium mb-2 md:my-1 text-center text-black'>
            <span className='text-red-500 text-lg'>❤</span>&nbsp; Made with Love
            &nbsp;
            <span className='text-red-500 text-lg'>❤</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
