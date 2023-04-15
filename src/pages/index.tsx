import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { useCookies } from 'react-cookie'
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri'
import ReactPlayer from 'react-player/lazy'
import { FaBaby } from 'react-icons/fa'
import Timer from '../components/timer'

export default function Home() {
  const [recipes, setRecipes] = useState([])

  // empty array of strings
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

  // send update request to backend and wait for response
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

  const unsaveRecipe = async (recipeID: string) => {
    try {
      const response = await axios.delete(
        'https://zero6babyserver.onrender.com/recipes',
        {
          data: {
            recipeID,
            userID,
          },
          headers: { authorization: cookies.access_token },
        }
      )
      setSavedRecipes(response.data.savedRecipes)
    } catch (err) {
      console.log(err)
    }
  }

  const isRecipeSaved = (recipeID: string) => savedRecipes.includes(recipeID)

  const toggleSaveRecipe = (recipeID: string) => {
    if (isRecipeSaved(recipeID)) {
      unsaveRecipe(recipeID)
    } else {
      saveRecipe(recipeID)
    }
  }

  const reversedRecipes = recipes.slice().reverse()

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {reversedRecipes.map(
            (recipe: {
              birthday: string
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
                      playing
                      width='100%'
                      height='100%'
                    />
                  )}
                  <button
                    className='absolute top-2 right-2 bg-neutral-50 bg-opacity-30 text-red-500 rounded-full p-3'
                    onClick={() => toggleSaveRecipe(recipe._id)}
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
                      <Timer birthday={recipe.birthday} />
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
