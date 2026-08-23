import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function PublicRukemPage() {
  const supabase = await createClient()

  const { data: rukemDana } = await supabase.from('rukem_transaksi').select('jenis, jumlah, created_at')
  const totalRukem = (rukemDana || []).reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  
  const { count: pesertaRukem } = await supabase.from('rukem_anggota').select('*', { count: 'exact', head: true }).eq('status_anggota', true)
  
  // Menghitung statistik pendaftaran vs iuran
  const totalPendaftaran = (rukemDana || []).filter(t => t.jenis === 'PENDAFTARAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  const totalIuran = (rukemDana || []).filter(t => t.jenis === 'IURAN_BULANAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-3xl font-bold text-primary">Laporan Dana Rukem</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto">
        <p className="text-gray-600 mb-6">
          Rukun Kematian (Rukem) adalah program gotong royong warga untuk meringankan beban keluarga yang tertimpa musibah.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">KK Terdaftar</div>
            <div className="text-2xl font-bold text-blue-600">{pesertaRukem || 0} Keluarga</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Dana Terkumpul</div>
            <div className="text-2xl font-bold text-accent">{formatRupiah(totalRukem)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left border-t pt-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Akumulasi Uang Pendaftaran:</div>
            <div className="font-semibold text-gray-800">{formatRupiah(totalPendaftaran)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Akumulasi Iuran Bulanan:</div>
            <div className="font-semibold text-gray-800">{formatRupiah(totalIuran)}</div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 text-center italic">
        *Data pribadi anggota (seperti nama, no telepon, dan blok rumah) dijaga kerahasiaannya dan hanya dapat diakses oleh admin/pengurus Rukem.
      </p>
    </div>
  )
}
