'use server'

import { UserRepository } from '@/db/professors.repository'

const userRepository = new UserRepository()

export async function listProfessors(params: { limit: number; offset: number; search?: string }) {
  try {
    const result = await userRepository.list(params)
    return result.items
  } catch (error) {
    console.error("Error fetching professors", error)
    throw new Error("Failed to fetch professors")
  }
}