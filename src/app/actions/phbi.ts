'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Ambil semua kegiatan PHBI
export async function getKegiatanPHBI() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('phbi_kegiatan')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching PHBI kegiatan:', error)
    return []
  }
  return data
}

// 2. Tambah Kegiatan PHBI (Oleh Admin)
export async function addKegiatanPHBI(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  // Cek role user (Hanya MASTER_ADMIN atau ADMIN yang boleh buat kegiatan)
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'MASTER_ADMIN' && profile.role !== 'ADMIN')) {
    return { error: 'Anda tidak memiliki akses untuk membuat kegiatan PHBI.' }
  }

  const nama = formData.get('nama') as string
  const tanggal = formData.get('tanggal') as string
  const lokasi = formData.get('lokasi') as string
  const target_anggaran = parseFloat(formData.get('target_anggaran') as string)
  const deskripsi = formData.get('deskripsi') as string

  const { error } = await supabase
    .from('phbi_kegiatan')
    .insert([
      { nama, tanggal, lokasi, target_anggaran, deskripsi }
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/phbi')
  return { success: true }
}

// 3. Ambil Detail Kegiatan beserta Transaksi (Pemasukan & Pengeluaran)
export async function getDetailKegiatanPHBI(kegiatanId: string) {
  const supabase = await createClient()
  
  const { data: kegiatan, error: errKegiatan } = await supabase
    .from('phbi_kegiatan')
    .select('*')
    .eq('id', kegiatanId)
    .single()

  const { data: transaksi, error: errTransaksi } = await supabase
    .from('phbi_transaksi')
    .select(`
      *,
      profiles:user_id(full_name, role),
      reviewer:reviewer_id(full_name)
    `)
    .eq('kegiatan_id', kegiatanId)
    .order('created_at', { ascending: false })

  // Cek user yang login untuk tau role-nya
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null }

  return { 
    kegiatan: kegiatan || null, 
    transaksi: transaksi || [],
    userRole: profile?.role || 'PETUGAS',
    userId: user?.id
  }
}

// 4. Tambah Transaksi PHBI (Bisa Petugas atau Admin)
export async function addTransaksiPHBI(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const kegiatan_id = formData.get('kegiatan_id') as string
  const tanggal = formData.get('tanggal') as string
  const jenis = formData.get('jenis') as string // PEMASUKAN atau PENGELUARAN
  const nama_item_donatur = formData.get('nama_item_donatur') as string
  const jumlah = parseFloat(formData.get('jumlah') as string)
  const metode = formData.get('metode') as string
  const kategori = formData.get('kategori') as string
  const keterangan = formData.get('keterangan') as string

  // Workflow Status Otomatis
  // Jika role = PETUGAS, otomatis jadi SUBMITTED
  // Jika role = ADMIN/MASTER_ADMIN, otomatis jadi APPROVED
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const status_approval = profile?.role === 'PETUGAS' ? 'SUBMITTED' : 'APPROVED'

  const { error } = await supabase
    .from('phbi_transaksi')
    .insert([
      {
        kegiatan_id,
        tanggal,
        jenis,
        nama_item_donatur,
        jumlah,
        metode,
        kategori,
        keterangan,
        user_id: user.id,
        status_approval
      }
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/phbi/${kegiatan_id}`)
  return { success: true }
}

// 5. Review Transaksi PHBI (Oleh Admin/Master Admin)
export async function reviewTransaksiPHBI(transaksiId: string, status: string, catatan: string, kegiatanId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role === 'PETUGAS') {
    return { error: 'Anda tidak memiliki akses untuk melakukan review.' }
  }

  const { error } = await supabase
    .from('phbi_transaksi')
    .update({
      status_approval: status,
      catatan_review: catatan || null,
      reviewer_id: user.id
    })
    .eq('id', transaksiId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/phbi/${kegiatanId}`)
  return { success: true }
}
