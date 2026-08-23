import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function PublicKasPage() {
  const supabase = await createClient()

  // Ambil hanya data yang PUBLISHED
  const { data: transaksi } = await supabase
    .from('kas_musholla')
    .select('tanggal, jenis, kategori, jumlah, keterangan')
    .eq('status', 'PUBLISHED')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })

  const totalPemasukan = (transaksi || []).filter(t => t.jenis === 'PEMASUKAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  const totalPengeluaran = (transaksi || []).filter(t => t.jenis === 'PENGELUARAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  const saldoAkhir = totalPemasukan - totalPengeluaran

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-3xl font-bold text-primary">Laporan Kas Musholla</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Pemasukan</div>
          <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</div>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Pengeluaran</div>
          <div className="text-2xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</div>
        </div>
        <div className="bg-emerald-50 rounded-xl shadow border border-emerald-100 p-6 text-center">
          <div className="text-primary text-sm font-bold mb-1">Saldo Akhir</div>
          <div className="text-3xl font-extrabold text-primary">{formatRupiah(saldoAkhir)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">Rincian Transaksi Publik</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-500 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!transaksi || transaksi.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada laporan kas yang dipublikasikan.</td>
                </tr>
              ) : (
                transaksi.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{t.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{t.kategori}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${t.jenis === 'PEMASUKAN' ? 'text-green-700' : 'text-red-700'}`}>
                        {t.jenis}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${t.jenis === 'PEMASUKAN' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.jenis === 'PEMASUKAN' ? '+' : '-'}{formatRupiah(Number(t.jumlah))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center italic">
        *Demi privasi warga dan donatur, identitas lengkap dan alamat tidak dipublikasikan dalam halaman transparansi umum ini.
      </p>
    </div>
  )
}
