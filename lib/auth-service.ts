/**
 * Authentication Service
 *
 * This service handles user authentication, registration, and session management.
 * It provides functions for signing up, signing in, signing out, and retrieving the current user.
 *
 * In a production environment, this would connect to a backend authentication service
 * or use a service like NextAuth.js, Clerk, or Auth0.
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "instructor" | "admin"
  walletAddress?: string
  tokenBalance: number
  enrolledCourses: string[]
  completedCourses: string[]
  createdAt: string
}

interface SignUpData {
  name: string
  email: string
  password: string
}

interface SignInData {
  email: string
  password: string
}

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/users/john.jpg",
    role: "user",
    walletAddress: "0x1234...5678",
    tokenBalance: 150,
    enrolledCourses: ["1", "2"],
    completedCourses: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/users/jane.jpg",
    role: "instructor",
    walletAddress: "0x5678...9012",
    tokenBalance: 450,
    enrolledCourses: [],
    completedCourses: [],
    createdAt: new Date().toISOString(),
  },
]

// Auth store with Zustand
interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  updateUser: (data: Partial<User>) => void
  addTokens: (amount: number) => void
  enrollInCourse: (courseId: string) => void
  completeCourse: (courseId: string) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      signUp: async (data: SignUpData) => {
        set({ isLoading: true, error: null })

        try {
          // Check if email already exists
          const emailExists = MOCK_USERS.some((user) => user.email === data.email)
          if (emailExists) {
            set({ isLoading: false, error: "Email already in use" })
            return { success: false, error: "Email already in use" }
          }

          // Create new user
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: "user",
            tokenBalance: 50, // Starting balance
            enrolledCourses: [],
            completedCourses: [],
            createdAt: new Date().toISOString(),
          }

          // In a real app, we would send this to an API
          // For now, we'll just set it in our store
          set({ user: newUser, isLoading: false })

          return { success: true }
        } catch (error) {
          set({ isLoading: false, error: "Failed to sign up" })
          return { success: false, error: "Failed to sign up" }
        }
      },

      signIn: async (data: SignInData) => {
        set({ isLoading: true, error: null })

        try {
          // Find user by email
          const user = MOCK_USERS.find((user) => user.email === data.email)

          // In a real app, we would verify the password
          // For demo purposes, we'll just check if the user exists
          if (!user) {
            set({ isLoading: false, error: "Invalid credentials" })
            return { success: false, error: "Invalid credentials" }
          }

          set({ user, isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false, error: "Failed to sign in" })
          return { success: false, error: "Failed to sign in" }
        }
      },

      signOut: () => {
        set({ user: null })
      },

      updateUser: (data: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) return

        set({ user: { ...currentUser, ...data } })
      },

      addTokens: (amount: number) => {
        const currentUser = get().user
        if (!currentUser) return

        set({
          user: {
            ...currentUser,
            tokenBalance: currentUser.tokenBalance + amount,
          },
        })
      },

      enrollInCourse: (courseId: string) => {
        const currentUser = get().user
        if (!currentUser) return

        if (currentUser.enrolledCourses.includes(courseId)) return

        set({
          user: {
            ...currentUser,
            enrolledCourses: [...currentUser.enrolledCourses, courseId],
          },
        })
      },

      completeCourse: (courseId: string) => {
        const currentUser = get().user
        if (!currentUser) return

        if (currentUser.completedCourses.includes(courseId)) return

        set({
          user: {
            ...currentUser,
            completedCourses: [...currentUser.completedCourses, courseId],
            tokenBalance: currentUser.tokenBalance + 100, // Reward for completing course
          },
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Helper functions that use the store
export async function signUp(data: SignUpData): Promise<void> {
  const result = await useAuth.getState().signUp(data)
  if (!result.success) {
    throw new Error(result.error)
  }
}

export async function signIn(data: SignInData): Promise<void> {
  const result = await useAuth.getState().signIn(data)
  if (!result.success) {
    throw new Error(result.error)
  }
}

export async function signOut(): Promise<void> {
  useAuth.getState().signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  return useAuth.getState().user
}

export async function becomeInstructor(): Promise<void> {
  const currentUser = useAuth.getState().user
  if (!currentUser) throw new Error("Not authenticated")

  useAuth.getState().updateUser({ role: "instructor" })
}

export async function addTokensToUser(amount: number): Promise<void> {
  useAuth.getState().addTokens(amount)
}

