import { UserModel } from "./user.model.js"
import { SignupInput, LoginInput } from "./user.schema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}
const JWT_EXPIRES_IN = "7d"

export const createUser = async (data: SignupInput) => {
  const existingUser = await UserModel.findOne({ email: data.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

  const user = await UserModel.create({
    name: data.name,
    email: data.email,
    password: hashedPassword
  })

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email
    }
  }
}

export const verifyLogin = async (data: LoginInput) => {
  const user = await UserModel.findOne({ email: data.email })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email
    }
  }
}
