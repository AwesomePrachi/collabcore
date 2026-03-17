import { create } from "zustand"

type Cursor = {
  userId: string
  name: string
  color: string
  position: number
}

type CursorStore = {
  cursors: Cursor[]
  updateCursor: (cursor: Cursor) => void
}

export const useCursorStore = create<CursorStore>((set) => ({
  cursors: [],

  updateCursor: (cursor) =>
    set((state) => {
      const others = state.cursors.filter(
        (c) => c.userId !== cursor.userId
      )

      return {
        cursors: [...others, cursor],
      }
    }),
}))