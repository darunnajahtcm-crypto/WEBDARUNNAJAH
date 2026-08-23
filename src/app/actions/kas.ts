'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getKasMusholla() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('kas_musholla')
    .select('*')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching kas:', error)
    return []
  }

  return data
}

export async function addKasTransaction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const jenis = formData.get('jenis') as string
  const kategori = formData.get('kategori') as string
  const pihak_terkait = formData.get('pihak_terkait') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const metode = formData.get('metode') as string
  const keterangan = formData.get('keterangan') as string
  const tanggal = formData.get('tanggal') as string
  // Assuming status for now is PUBLISHED for Master Admin, but we can set default
  const status = 'PUBLISHED'

  const { error } = await supabase
    .from('kas_musholla')
    .insert([
      {
        tanggal,
        jenis,
        kategori,
        pihak_terkait,
        jumlah,
        metode,
        keterangan,
        user_id: user.id,
        status
      }
    ])

  if (error) {
    console.error('Error inserting kas:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/kas')
  return { success: true }
}
