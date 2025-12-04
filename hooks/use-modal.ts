"use client"

import { create } from "zustand"

type ModalType = "auth" | "onboard-agent" | null

interface ModalStore {
  activeModal: ModalType
  authMode: "login" | "signup"
  authRole: "client" | "reseller" | "isv"
  openModal: (type: ModalType, options?: { mode?: "login" | "signup", role?: "client" | "reseller" | "isv" }) => void
  closeModal: () => void
  setAuthMode: (mode: "login" | "signup") => void
  setAuthRole: (role: "client" | "reseller" | "isv") => void
}

export const useModal = create<ModalStore>((set) => ({
  activeModal: null,
  authMode: "login",
  authRole: "client",
  openModal: (type, options) => set({ 
    activeModal: type, 
    authMode: options?.mode || "login",
    authRole: options?.role || "client"
  }),
  closeModal: () => set({ activeModal: null }),
  setAuthMode: (mode) => set({ authMode: mode }),
  setAuthRole: (role) => set({ authRole: role }),
}))
