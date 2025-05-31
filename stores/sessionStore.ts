import { create } from 'zustand'
import type { Session } from '@/lib/mock-data'
import { sessions as initialSessions } from '@/lib/mock-data'

interface SessionStore {
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
  addSession: (session: Session) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: initialSessions,
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
})) 