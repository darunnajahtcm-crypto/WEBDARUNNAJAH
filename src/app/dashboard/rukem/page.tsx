import { getAnggotaRukem } from '@/app/actions/rukem'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function RukemPage() {
  const anggota = await getAnggotaRukem()
  const supabase = await createClient()
  
  // Hitung total dana Rukem (Pendaftaran + Iuran) dari tabel transaksi
  const { data: transaksi } = await supabase.from('rukem_transaksi').select('jumlah')
  const totalDana = (transaksi || []).reduce((acc, curr) => acc + Number(curr.jumlah), 0)

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Rukem</h2>
          <p className="text-gray-600 text-sm">Kelola data anggota dan iuran Rukun Kematian.</p>
        </div>
        <Link 
          href="/dashboard/rukem/tambah-anggota" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Tambah Anggota
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Anggota Terdaftar</div>
          <div className="text-2xl font-bold text-gray-800">{anggota.length} KK</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 bg-emerald-50">
          <div className="text-gray-600 text-sm font-bold mb-1">Total Dana Rukem Terkumpul</div>
          <div className="text-2xl font-bold text-accent">{formatRupiah(totalDana)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700">
          Daftar Anggota Rukem
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">No. Rumah</th>
                <th className="px-6 py-4">Kepala Keluarga</th>
                <th className="px-6 py-4">Jml. Keluarga</th>
                <th className="px-6 py-4">No. HP</th>
                <th className="px-6 py-4">Tgl Daftar</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {anggota.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada anggota yang terdaftar.
                  </td>
                </tr>
              ) : (
                anggota.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      Blok {a.blok} / {a.no_rumah}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">{a.nama_kk}</td>
                    <td className="px-6 py-4 text-center">{a.jumlah_keluarga} Jiwa</td>
                    <td className="px-6 py-4">{a.no_hp || '-'}</td>
                    <td className="px-6 py-4">
                      {new Date(a.tanggal_daftar).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/dashboard/rukem/${a.id}`}
                        className="text-xs bg-accent text-white px-3 py-1.5 rounded hover:bg-yellow-600 transition"
                      >
                        Detail & Iuran
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
