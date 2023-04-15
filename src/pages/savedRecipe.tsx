import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { FaBaby } from 'react-icons/fa'
import Link from 'next/link'
import ReactPlayer from 'react-player'

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([])

  const userID = useGetUserID()
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://zero6babyserver.onrender.com/recipes/savedRecipes/${userID}`
        )
        setSavedRecipes(response.data.savedRecipes)
      } catch (err) {
        console.log(err)
      }
    }

    fetchSavedRecipes()
  }, [userID])

  const reversedSavedRecipes = savedRecipes.slice().reverse()

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {reversedSavedRecipes.map(
            (recipe: {
              _id: string
              name: string
              ingredients: Array<string>
              instructions: string
              imageUrl: string
              cookingTime: number
            }) => (
              <li
                className='border border-gray-200 rounded-lg'
                key={recipe._id}
              >
                <div className='relative w-full h-96 sm:h-[450px] lg:h-[600px]'>
                  {recipe.imageUrl.endsWith('.jpg') ||
                  recipe.imageUrl.endsWith('.png') ? (
                    <Link
                      href={recipe.imageUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className='object-cover'
                        fill
                      />
                    </Link>
                  ) : (
                    <ReactPlayer
                      url={recipe.imageUrl}
                      fill
                      controls
                      width='100%'
                      height='100%'
                    />
                  )}
                </div>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-3xl font-extrabold pt-1 pb-3 mb-0'>
                      {recipe.name}
                    </h3>
                    <div className='flex space-x-1 items-center'>
                      <FaBaby size={30} />
                      <p className=' text-gray-800 text-sm'>
                        {recipe.cookingTime} days
                      </p>
                    </div>
                  </div>
                  {recipe.ingredients.map((ingredient) => (
                    <p key={ingredient} className='text-gray-600 text-sm '>
                      照片地點：{ingredient}
                    </p>
                  ))}
                  <p className='text-gray-600 text-sm my-4'>
                    {recipe.instructions}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  )
}
