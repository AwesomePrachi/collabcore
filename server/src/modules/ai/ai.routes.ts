import { Router } from "express"
import { summarizeText, improveWriting } from "./ai.service.js"

const router = Router()

router.post("/summarize", async (req, res) => {

  try {

    const { content } = req.body

    const result = await summarizeText(content)

    res.json({ result })

  } catch (error) {

    console.error("AI summarize error:", error)

    res.status(500).json({
      message: "AI summarize failed"
    })

  }

})

router.post("/improve", async (req, res) => {

  try {

    const { content } = req.body

    const result = await improveWriting(content)

    res.json({ result })

  } catch (error) {

    console.error("AI improve error:", error)

    res.status(500).json({
      message: "AI improve failed"
    })

  }

})

export default router
