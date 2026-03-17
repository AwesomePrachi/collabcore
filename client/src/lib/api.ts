import axios from "axios"
import { useAuthStore } from "@/store/authStore"

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      const { logout } = useAuthStore.getState()
      logout()
      if (typeof window !== "undefined") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  }
)