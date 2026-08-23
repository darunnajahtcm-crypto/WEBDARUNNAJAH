'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePengaturan(formData: FormData) {
  const supabase = await createClient()
  
  // Check if admin/master (only auth check for simplicity, RLS handles the rest)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const nama_musholla = formData.get('nama_musholla') as string
  const alamat = formData.get('alamat') as string
  const kontak_hp = formData.get('kontak_hp') as string
  const email = formData.get('email') as string

  // update or insert?
  if (id) {
    const { error } = await supabase
      .from('pengaturan_web')
      .update({ nama_musholla, alamat, kontak_hp, email, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('pengaturan_web')
      .insert([{ nama_musholla, alamat, kontak_hp, email }])
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/dashboard/pengaturan')
  return { success: true }
}
