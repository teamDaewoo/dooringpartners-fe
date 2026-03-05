import { create } from 'zustand'

interface TopbarState {
  openDropdown: string | null
  setOpenDropdown: (label: string | null) => void
}

export const useTopbarStore = create<TopbarState>()((set) => ({
  openDropdown: null,
  setOpenDropdown: (label) => set({ openDropdown: label }),
}))
