'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Gunakan Service Role Key untuk bypass RLS dan membuat user via Admin API
const supabaseAdmin = createSupabaseClient(
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

    // 2. Update tabel profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ full_name, role })
      .eq('id', authData.user.id)

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

export async function deleteUserAction(id: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (error) return { error: error.message }

    // Profil otomatis terhapus jika ada ON DELETE CASCADE, tapi amankan saja:
    await supabaseAdmin.from('profiles').delete().eq('id', id)
    
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function updateUserAction(formData: FormData) {
  const id = formData.get('id') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as string
  const password = formData.get('password') as string

  try {
    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ full_name, role })
      .eq('id', id)
    if (profileError) return { error: profileError.message }

    // Update password if provided
    if (password && password.trim() !== '') {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password: password
      })
      if (authError) return { error: authError.message }
    }

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function getAllUsersAdmin() {
  const supabase = await createClient() // Sekarang memanggil server client
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // Cek role diri sendiri
  const { data: myProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const myRole = myProfile?.role

  // Fetch semua profiles
  let { data: profiles } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false })
  
  if (!profiles) return []

  // Jika bukan MASTER_ADMIN, sembunyikan MASTER_ADMIN dari daftar
  if (myRole !== 'MASTER_ADMIN') {
    profiles = profiles.filter(p => p.role !== 'MASTER_ADMIN')
  }

  // Fetch auth users to get email/username
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
  const authUsers = authData?.users || []
  
  return profiles.map(p => {
    const authUser = authUsers.find(u => u.id === p.id)
    // Buang @musholla.com untuk dapat username
    const username = authUser?.email?.replace('@musholla.com', '') || 'unknown'
    return { ...p, username, myRole } // Kirim myRole ke client untuk membatasi UI
  })
}
