'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { initializeHeatmapForUser } from '@/app/services/IHeatmapService'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  // Initialize heatmap for user if they don't have one
  try {
    await initializeHeatmapForUser()
  } catch (error) {
    console.error('Error initializing heatmap:', error)
    // Continue with login even if heatmap initialization fails
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  // Initialize heatmap for new user
  try {
    await initializeHeatmapForUser()
  } catch (error) {
    console.error('Error initializing heatmap:', error)
    // Continue with signup even if heatmap initialization fails
  }

  revalidatePath('/', 'layout')
  redirect('/')
}