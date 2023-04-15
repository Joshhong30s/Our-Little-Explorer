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
  const [allowYoutubeUrl, setAllowYoutubeUrl] = useState(false)
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
    if (allowYoutubeUrl) {
      const inputUrl = e.target.value
      setRecipe({
        ...recipe,
        imageUrl: inputUrl,
      })
    } else {
      const file = e.target.files[0]
      setFile(file)

      if (file) {
        const clientId = '204e2ddd7271745'
        const auth = 'Client-ID ' + clientId
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
                Authorization: auth,
                Accept: 'application/json',
              },
            }
          )

          alert('相片上傳成功，可以送出')
          setRecipe({
            ...recipe,
            imageUrl: response.data.data.link,
          })
        } catch (err) {
          console.log(err)
          alert('相片上傳失敗')
        }
      } else {
        alert('請上傳相片')
      }
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('https://zero6babyserver.onrender.com/recipes', recipe, {
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
      style={{ backgroundImage: "url('comi.jpg')" }}
    >
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mt-10'>
        <h2 className='text-2xl text-center font-medium mb-6'>小寶日誌..</h2>
        <form className='space-y-4' onSubmit={onSubmit}>
          <div>
            <label
              htmlFor='name'
              className='block text-gray-700 font-medium text-lg'
            >
              相片標題
            </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='...這張照片是'
              onChange={handleChange}
              className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
            />
          </div>
          <div>
            <label
              htmlFor='ingredients'
              className='block text-gray-700 font-medium text-lg'
            >
              相片資訊
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
              加入地點和拍攝者
            </button>
          </div>
          <div className='whitespace-pre-wrap'>
            <label
              htmlFor='instructions'
              className='block text-gray-700 font-medium text-lg'
            >
              照片描述
            </label>
            <textarea
              id='instructions'
              name='instructions'
              onChange={handleChange}
              className='mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300  focus:outline-none whitespace-pre-wrap'
              placeholder='...寫下照片描述'
            ></textarea>
          </div>
          <div>
            <label
              htmlFor='cookingTime'
              className='block text-gray-700 font-medium text-lg'
            >
              相片年齡
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
            <input
              type='radio'
              id='image'
              name='image'
              onChange={() => setAllowYoutubeUrl(true)}
              className='mr-2'
            />
            <label htmlFor='image'>貼上 YouTube 影片連結</label>
            <br />
            <input
              type='radio'
              id='image'
              name='image'
              onChange={() => setAllowYoutubeUrl(false)}
              className='mr-2'
            />
            <label htmlFor='image'>上傳小寶照片</label>
          </div>
          <div>
            {allowYoutubeUrl && (
              <input
                type='text'
                id='youtubeUrl'
                name='youtubeUrl'
                placeholder='貼上 YouTube 連結'
                onChange={handleImageChange}
                className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
              />
            )}
            {!allowYoutubeUrl && (
              <input
                type='file'
                id='image'
                name='image'
                onChange={handleImageChange}
                className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50'
              />
            )}
            {file && <img src={URL.createObjectURL(file)} alt='' />}
          </div>

          <div className='py-4 text-center'>
            <button
              type='submit'
              className='bg-orange-950 text-black py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300'
            >
              確認送出
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
