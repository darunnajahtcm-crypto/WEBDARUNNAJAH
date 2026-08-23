import { getDetailAnggota } from '@/app/actions/rukem'
import Link from 'next/link'
import IuranForm from './IuranForm'

export default async function DetailAnggotaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const detail = await getDetailAnggota(resolvedParams.id)

  if (!detail || !detail.anggota) {
    return <div className="p-6">Data anggota tidak ditemukan.</div>
  }

  const { anggota, transaksi } = detail

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rukem" className="text-gray-500 hover:text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Detail Anggota Rukem</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Informasi Anggota & Form Iuran */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Informasi Kepala Keluarga</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Nama Lengkap</span>
                <span className="font-semibold text-gray-800 text-lg">{anggota.nama_kk}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Nomor Rumah</span>
                <span className="font-medium text-gray-800">Blok {anggota.blok} No. {anggota.no_rumah}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Jumlah Anggota Keluarga</span>
                <span className="font-medium text-gray-800">{anggota.jumlah_keluarga} Jiwa</span>
              </div>
              <div>
                <span className="text-gray-500 block">No. HP / WhatsApp</span>
                <span className="font-medium text-gray-800">{anggota.no_hp || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status Anggota</span>
                {anggota.status_anggota ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Aktif</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Tidak Aktif</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Catat Pembayaran Iuran</h3>
            <IuranForm anggotaId={anggota.id} />
          </div>
        </div>

        {/* Kolom Riwayat Transaksi */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Riwayat Pembayaran (Pendaftaran & Iuran)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Tanggal Bayar</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Bulan Tagihan</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transaksi.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Belum ada riwayat transaksi.
                    </td>
                  </tr>
                ) : (
                  transaksi.map((t: any) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          t.jenis === 'PENDAFTARAN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {t.jenis.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {t.bulan_tahun ? new Date(t.bulan_tahun).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{t.metode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-green-600">
                        {formatRupiah(Number(t.jumlah))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
