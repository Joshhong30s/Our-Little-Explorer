import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { FaBaby } from 'react-icons/fa'
import { useCookies } from 'react-cookie'
import Link from 'next/link'
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri'

export default function SavedRecipes() {
  interface Recipe {
    _id: string
    name: string
    ingredients: string[]
    instructions: string
    imageUrl: string
    cookingTime: number
  }

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [savedRecipes, setSavedRecipes] = useState<string[]>([])
  const [cookies, _] = useCookies(['access_token'])
  const userID = useGetUserID()
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          'https://zero6babyserver.onrender.com/recipes'
        )
        setRecipes(response.data.recipes)
      } catch (err) {
        console.log(err)
      }
    }

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

    fetchRecipes()
    fetchSavedRecipes()
  }, [userID])

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

  const savedRecipesList = recipes.filter((recipe) =>
    savedRecipes.includes(recipeID)
  )

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {savedRecipesList.map(
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
                  <Link
                    href={recipe.imageUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className='object-cover'
                      placeholder='blur'
                      fill
                    />
                  </Link>
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
