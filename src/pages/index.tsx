import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { useCookies } from 'react-cookie'
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri'

import { FaBaby } from 'react-icons/fa'

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState<string[]>([])
  const [cookies, _] = useCookies(['access_token'])
  const userID = useGetUserID()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          'https://zero6babyserver.onrender.com/recipes'
        )
        setRecipes(response.data)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://zero6babyserver.onrender.com/recipes/savedRecipes/ids/${userID}`
        )
        setSavedRecipes(response.data.savedRecipes)
      } catch (err) {
        console.log(err)
      }
    }

    fetchRecipes()

    if (cookies.access_token) fetchSavedRecipes()
  }, [cookies.access_token, userID])

  const saveRecipe = async (recipeID: string) => {
    try {
      const response = await axios.put(
        'https://zero6babyserver.onrender.com/recipes',
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      )
      setSavedRecipes(response.data.savedRecipes)
    } catch (err) {
      console.log(err)
    }
  }

  const isRecipeSaved = (id: string) =>
    savedRecipes && savedRecipes.includes(id)

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {recipes.map(
            (recipe: {
              _id: string
              name: string
              ingredients: Array<string>
              instructions: string
              imageUrl: string
              cookingTime: number
            }) => (
              <li
                key={recipe._id}
                className='border border-gray-200 rounded-lg'
              >
                <div className='relative w-full h-96 sm:h-[450px] lg:h-[600px]'>
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className='object-cover'
                    placeholder='blur'
                    fill
                  />
                  <button
                    className='absolute top-2 right-2 bg-neutral-50 bg-opacity-30 text-red-500 rounded-full p-3'
                    onClick={() => saveRecipe(recipe._id)}
                    disabled={isRecipeSaved(recipe._id)}
                  >
                    {isRecipeSaved(recipe._id) ? (
                      <RiHeartFill
                        size={40}
                        className='text-red-500 text-base hover:scale-125'
                      />
                    ) : (
                      <RiHeartAddLine
                        size={40}
                        className='text-base hover:scale-125'
                      />
                    )}
                  </button>
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
                      拍照地點： {ingredient} <br />
                      拍照的人： {ingredient}
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
