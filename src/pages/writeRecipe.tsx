'use client'

import { useState } from 'react'
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserId'
import { useCookies } from 'react-cookie'
import Image from 'next/image'

type RecipeType = {
  name: string
  ingredients: Array<string>
  instructions: string
  imageUrl: string
  cookingTime: number
  userOwner: string
}

export default function WriteRecipe() {
  const userID = useGetUserID()
  const [file, setFile] = useState(null)
  const [cookies, _] = useCookies(['access_token'])
  const [recipe, setRecipe] = useState<RecipeType>({
    name: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    cookingTime: 0,
    userOwner: userID ?? '',
  })

  const handleChange = (e: any) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value,
    })
  }

  const handleIngredientChange = (e: any, index: number) => {
    const ingredients = recipe.ingredients
    ingredients[index] = e.target.value
    setRecipe({
      ...recipe,
      ingredients: ingredients,
    })
  }

  const addIngredients = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ''],
    })
  }

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0]
    setFile(file)

    if (file) {
      const clientId = '204e2ddd7271745',
        auth = 'Client-ID ' + clientId
      const data = new FormData()
      const filename = file.name
      data.append('name', filename)
      data.append('image', file)
      try {
        const response = await axios.post(
          'https://api.imgur.com/3/image',
          data,
          {
            headers: {
              // Setting header
              Authorization: auth,
              Accept: 'application/json',
            },
          }
        )

        // Handling success
        alert('Image uploaded')
        setRecipe({
          ...recipe,
          imageUrl: response.data.data.link,
        })
      } catch (err) {
        console.log(err)
        alert('Failed to upload image')
      }
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/recipes', recipe, {
        headers: { authorization: cookies.access_token },
      })
      console.log('recired created')
      window.location.replace('/')
    } catch (error) {
      console.log(error)
      alert('Failed to upload image')
    }
  }

  return (
    <div
      className='min-h-screen bg-gray-900/70 flex flex-col items-center bg-cover bg-center '
      style={{ backgroundImage: "url('recipebg.jpg')" }}
    >
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mt-10'>
        <h2 className='text-2xl text-center font-medium mb-6'>
          分享你的食譜..
        </h2>
        <form className='space-y-4' onSubmit={onSubmit}>
          <div>
            <label
              htmlFor='name'
              className='block text-gray-700 font-medium text-lg'
            >
              食譜名稱
            </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='...寫下你的食譜名稱'
              onChange={handleChange}
              className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
            />
          </div>
          <div>
            <label
              htmlFor='ingredients'
              className='block text-gray-700 font-medium text-lg'
            >
              食譜材料
            </label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type='text'
                  name='ingredients'
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(e, index)}
                  className='mt-1 block w-full  h-8 border-b-2 border-gray-300  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
                />
              </div>
            ))}
            <button
              onClick={addIngredients}
              type='button'
              className='mt-2 bg-orange-950 text-black py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300'
            >
              點選加入一項材料
            </button>
          </div>
          <div className='whitespace-pre-wrap'>
            <label
              htmlFor='instructions'
              className='block text-gray-700 font-medium text-lg'
            >
              食譜作法
            </label>
            <textarea
              id='instructions'
              name='instructions'
              onChange={handleChange}
              className='mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300  focus:outline-none whitespace-pre-wrap'
              placeholder='...寫下你的食譜做法'
            ></textarea>
          </div>
          <div>
            <label
              htmlFor='cookingTime'
              className='block text-gray-700 font-medium text-lg'
            >
              所需時間 (分)
            </label>
            <input
              type='text'
              id='cookingTime'
              name='cookingTime'
              onChange={handleChange}
              className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
            />
          </div>
          <div>
            <label
              htmlFor='image'
              className='block text-gray-700 font-medium text-lg'
            >
              上傳食譜照片
            </label>
            {file && (
              <Image
                src={URL.createObjectURL(file)}
                alt=''
                width={300}
                height={300}
              />
            )}
            <input
              type='file'
              id='image'
              name='image'
              onChange={handleImageChange}
              className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
            />
          </div>
          <div className='py-4 text-center'>
            <button
              type='submit'
              className='bg-orange-950 text-black py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300'
            >
              分享我的食譜
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
