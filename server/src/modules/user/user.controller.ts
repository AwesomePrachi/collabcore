import { Request, Response } from "express"
import { createUser, verifyLogin } from "./user.service.js"
import { signupSchema, loginSchema } from "./user.schema.js"

export const signupHandler = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.parse(req.body)
    const user = await createUser(parsed)
    return res.status(201).json(user)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input", errors: error.errors })
    }
    return res.status(400).json({ message: error.message || "Signup failed" })
  }
}

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body)
    const result = await verifyLogin(parsed)
    return res.status(200).json(result)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input", errors: error.errors })
    }
    return res.status(401).json({ message: error.message || "Login failed" })
  }
}
