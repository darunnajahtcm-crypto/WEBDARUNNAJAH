import { getDetailKegiatanPHBI } from '@/app/actions/phbi'
import Link from 'next/link'
import ReviewAction from './ReviewAction'

export default async function DetailPHBIPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const data = await getDetailKegiatanPHBI(resolvedParams.id)

  if (!data || !data.kegiatan) {
    return <div className="p-6">Data kegiatan tidak ditemukan.</div>
  }

  const { kegiatan, transaksi, userRole, userId } = data

  const totalPemasukan = transaksi.filter((t: any) => t.jenis === 'PEMASUKAN' && (t.status_approval === 'APPROVED' || t.status_approval === 'PUBLISHED')).reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0)
  const totalPengeluaran = transaksi.filter((t: any) => t.jenis === 'PENGELUARAN' && (t.status_approval === 'APPROVED' || t.status_approval === 'PUBLISHED')).reduce((acc: number, curr: any) => acc + Number(curr.jumlah), 0)
  const saldo = totalPemasukan - totalPengeluaran

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  const isAdmin = userRole === 'MASTER_ADMIN' || userRole === 'ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/phbi" className="text-gray-500 hover:text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{kegiatan.nama}</h2>
        </div>
        <Link 
          href={`/dashboard/phbi/${kegiatan.id}/tambah-transaksi`} 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Input Transaksi
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Informasi Kegiatan</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Tanggal</span>
                <span className="font-semibold text-gray-800">{new Date(kegiatan.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Lokasi</span>
                <span className="font-medium text-gray-800">{kegiatan.lokasi}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Target Anggaran</span>
                <span className="font-medium text-blue-600">{formatRupiah(kegiatan.target_anggaran)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${kegiatan.status_kegiatan === 'AKTIF' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {kegiatan.status_kegiatan}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 bg-emerald-50">
             <div className="text-gray-600 text-sm font-bold mb-2">Ringkasan Keuangan (Disetujui)</div>
             <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Pemasukan:</span> <span className="text-green-600 font-semibold">{formatRupiah(totalPemasukan)}</span></div>
                <div className="flex justify-between text-sm"><span>Pengeluaran:</span> <span className="text-red-600 font-semibold">{formatRupiah(totalPengeluaran)}</span></div>
                <div className="flex justify-between text-base border-t border-emerald-200 pt-2 font-bold text-primary"><span>Saldo:</span> <span>{formatRupiah(saldo)}</span></div>
             </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 flex justify-between items-center">
             Data Transaksi Keuangan PHBI
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-600">
               <thead className="bg-white text-gray-500 uppercase text-xs border-b border-gray-200">
                 <tr>
                   <th className="px-4 py-3">Tgl</th>
                   <th className="px-4 py-3">Uraian / Donatur</th>
                   <th className="px-4 py-3">Jenis</th>
                   <th className="px-4 py-3 text-right">Jumlah</th>
                   <th className="px-4 py-3 text-center">Status</th>
                   <th className="px-4 py-3">Aksi Review</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {transaksi.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Belum ada data transaksi.</td>
                   </tr>
                 ) : (
                   transaksi.map((t: any) => {
                     // Petugas hanya boleh lihat transaksinya sendiri atau yang PUBLISHED
                     if (!isAdmin && t.user_id !== userId && t.status_approval !== 'PUBLISHED') return null;
                     
                     return (
                       <tr key={t.id} className="hover:bg-gray-50">
                         <td className="px-4 py-3 whitespace-nowrap">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                         <td className="px-4 py-3">
                           <div className="font-medium text-gray-800">{t.keterangan}</div>
                           <div className="text-xs text-gray-500">Oleh: {t.nama_item_donatur}</div>
                           {t.catatan_review && (
                             <div className="mt-1 text-xs text-red-600 bg-red-50 p-1 rounded">
                               <strong>Catatan Revisi:</strong> {t.catatan_review}
                             </div>
                           )}
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.jenis === 'PEMASUKAN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {t.jenis}
                           </span>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                           {formatRupiah(Number(t.jumlah))}
                         </td>
                         <td className="px-4 py-3 text-center">
                           <span className={`px-2 py-1 rounded text-xs font-bold border ${
                              t.status_approval === 'PUBLISHED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              t.status_approval === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                              t.status_approval === 'REVISION' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              t.status_approval === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-gray-100 text-gray-600 border-gray-300'
                           }`}>
                             {t.status_approval}
                           </span>
                         </td>
                         <td className="px-4 py-3 min-w-[150px]">
                           {isAdmin && <ReviewAction transaksiId={t.id} kegiatanId={kegiatan.id} currentStatus={t.status_approval} />}
                           {!isAdmin && t.status_approval === 'REVISION' && (
                             <span className="text-xs text-orange-600 italic">Harap input ulang data dengan benar</span>
                           )}
                         </td>
                       </tr>
                     )
                   })
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  )
}
