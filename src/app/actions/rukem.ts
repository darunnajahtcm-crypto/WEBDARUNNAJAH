'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Mengambil semua anggota Rukem
export async function getAnggotaRukem() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rukem_anggota')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching anggota rukem:', error)
    return []
  }
  return data
}

// Mengambil detail satu anggota beserta riwayat transaksinya
export async function getDetailAnggota(id: string) {
  const supabase = await createClient()
  
  const { data: anggota, error: errAnggota } = await supabase
    .from('rukem_anggota')
    .select('*')
    .eq('id', id)
    .single()

  const { data: transaksi, error: errTransaksi } = await supabase
    .from('rukem_transaksi')
    .select('*')
    .eq('anggota_id', id)
    .order('created_at', { ascending: true })

  if (errAnggota) {
    console.error('Error fetching detail anggota:', errAnggota)
    return null
  }

  return { anggota, transaksi: transaksi || [] }
}

// Menambah Anggota Baru beserta Uang Pendaftaran Otomatis
export async function addAnggotaRukem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const tanggal_daftar = formData.get('tanggal_daftar') as string
  const nama_kk = formData.get('nama_kk') as string
  const jumlah_keluarga = parseInt(formData.get('jumlah_keluarga') as string)
  const blok = formData.get('blok') as string
  const no_rumah = formData.get('no_rumah') as string
  const no_hp = formData.get('no_hp') as string
  
  // 1. Simpan Anggota Baru
  const { data: anggota, error: errAnggota } = await supabase
    .from('rukem_anggota')
    .insert([
      { tanggal_daftar, nama_kk, jumlah_keluarga, blok, no_rumah, no_hp }
    ])
    .select()
    .single()

  if (errAnggota || !anggota) {
    return { error: errAnggota?.message || 'Gagal menyimpan anggota' }
  }

  // 2. Otomatis catat Uang Pendaftaran (Misal: Rp 100.000)
  const { error: errTransaksi } = await supabase
    .from('rukem_transaksi')
    .insert([
      {
        anggota_id: anggota.id,
        jenis: 'PENDAFTARAN',
        jumlah: 100000,
        metode: 'CASH',
        user_id: user.id
      }
    ])

  if (errTransaksi) {
    return { error: 'Anggota tersimpan, tetapi gagal mencatat uang pendaftaran.' }
  }

  revalidatePath('/dashboard/rukem')
  return { success: true, id: anggota.id }
}

// Membayar Iuran Bulanan
export async function bayarIuranBulanan(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const anggota_id = formData.get('anggota_id') as string
  const bulan_tahun = formData.get('bulan_tahun') as string
  const metode = formData.get('metode') as string
  const jumlah = 10000 // Iuran rutin Rp 10.000

  const { error } = await supabase
    .from('rukem_transaksi')
    .insert([
      {
        anggota_id,
        jenis: 'IURAN_BULANAN',
        bulan_tahun,
        jumlah,
        metode,
        user_id: user.id
      }
    ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/rukem/${anggota_id}`)
  revalidatePath('/dashboard/rukem')
  return { success: true }
}
