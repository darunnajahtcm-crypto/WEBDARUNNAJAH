'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Gunakan Service Role Key untuk bypass RLS dan membuat user via Admin API
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function createAdminOrPetugas(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as string // 'ADMIN' | 'PETUGAS'

  if (!email || !password || !full_name || !role) {
    return { error: 'Semua kolom wajib diisi' }
  }

  try {
    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (authError) return { error: authError.message }

    // 2. Update tabel profiles (karena trigger di Supabase mungkin sudah membuatkannya otomatis)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ full_name, role })
      .eq('id', authData.user.id)

    // Jika update gagal (misal trigger belum dipasang), coba insert
    if (profileError) {
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert([{ id: authData.user.id, full_name, role }])
        
      if (insertError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return { error: insertError.message }
      }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
