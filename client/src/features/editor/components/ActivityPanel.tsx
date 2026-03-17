import { useEffect, useState } from "react"
import { api } from "@/lib/api"

type Activity = {
  _id: string
  publicId: string
  userId: string
  action: string
  createdAt: string
}

type Props = {
  documentId: string
}

export default function ActivityPanel({ documentId }: Props) {

  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {

    async function loadActivities() {
      const res = await api.get(`/activity/${documentId}`)
      setActivities(res.data)
    }

    loadActivities()

  }, [documentId])

  return (
    <div className="w-64 border-l theme-border p-4 theme-bg-base transition-colors duration-300">

      <h2 className="text-sm font-semibold mb-4 theme-text-base">
        Activity
      </h2>

      <div className="space-y-2">

        {activities.map((activity) => (

          <div
            key={activity._id}
            className="text-xs theme-text-muted"
          >
            {activity.userId.slice(0, 4)} {activity.action}
          </div>

        ))}

      </div>

    </div>
  )
}
