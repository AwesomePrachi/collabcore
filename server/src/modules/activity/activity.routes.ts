import { Router } from "express"
import { getActivities } from "./activity.service.js"

const router = Router()

router.get("/:publicId", async (req, res) => {
  const activities = await getActivities(req.params.publicId)
  res.json(activities)
})

export default router
