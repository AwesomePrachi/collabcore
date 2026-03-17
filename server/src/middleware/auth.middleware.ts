import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No API token provided" })
  }

  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) throw new Error("JWT_SECRET is not defined")
    const decoded = jwt.verify(token, jwtSecret) as { userId: string, email: string }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}
