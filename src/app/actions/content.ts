'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- PENGUMUMAN ---
export async function getPengumuman() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pengumuman')
    .select('*')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  return data || []
}

export async function addPengumuman(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const judul = formData.get('judul') as string
  const konten = formData.get('konten') as string
  const tanggal = formData.get('tanggal') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('pengumuman')
    .insert([{ judul, konten, tanggal, status, user_id: user.id }])

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/pengumuman')
  revalidatePath('/')
  return { success: true }
}

export async function deletePengumuman(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pengumuman').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/pengumuman')
  revalidatePath('/')
  return { success: true }
}

// --- GALERI ---
export async function getGaleri() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  return data || []
}

export async function addGaleri(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const judul = formData.get('judul') as string
  const keterangan = formData.get('keterangan') as string
  const image_url = formData.get('image_url') as string
  const tanggal = formData.get('tanggal') as string
  const status = formData.get('status') as string

  const { error } = await supabase
    .from('galeri')
    .insert([{ judul, keterangan, image_url, tanggal, status, user_id: user.id }])

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/galeri')
  revalidatePath('/')
  return { success: true }
}

export async function deleteGaleri(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('galeri').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/galeri')
  revalidatePath('/')
  return { success: true }
}
