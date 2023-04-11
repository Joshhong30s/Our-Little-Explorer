import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { IoMdAlarm } from 'react-icons/io'

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([])

  const userID = useGetUserID()
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipes/savedRecipes/${userID}`
        )
        setSavedRecipes(response.data.savedRecipes)
      } catch (err) {
        console.log(err)
      }
    }

    fetchSavedRecipes()
  }, [userID])

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {savedRecipes.map(
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
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className='object-cover'
                    fill
                  />
                </div>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-3xl font-extrabold pt-1 pb-3 mb-0'>
                      {recipe.name}
                    </h3>
                    <div className='flex space-x-1 items-center'>
                      <IoMdAlarm size={30} />
                      <p className=' text-gray-800 text-sm'>
                        {recipe.cookingTime} mins
                      </p>
                    </div>
                  </div>
                  {recipe.ingredients.map((ingredient) => (
                    <p key={ingredient} className='text-gray-600 text-sm '>
                      {ingredient}
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
