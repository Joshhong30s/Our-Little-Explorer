import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from './models/Users.js'

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.action === 'register') {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username: username })

    // check if username exists for any register request
    if (user) {
      return res.status(409).json({ message: 'User already exists' })
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // add user to database
    const newUser = new UserModel({ username, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'Successfully registered!' })
  } else if (req.method === 'POST' && req.body.action === 'login') {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username: username })

    if (!user) {
      return res.status(401).json({ message: 'User does not exist' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong password!' })
    }

    //create token if user information is correct
    const token = jwt.sign({ id: user._id }, 'secret')
    res.status(200).json({ token, userID: user._id })
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, 'secret', (err) => {
      if (err) return res.sendStatus(403)
      next()
    })
  } else {
    res.sendStatus(401)
  }
}
