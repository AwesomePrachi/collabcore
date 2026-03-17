import { Router } from "express"
import { signupHandler, loginHandler } from "./user.controller.js"

const router = Router()

router.post("/signup", signupHandler)
router.post("/login", loginHandler)

export default router
