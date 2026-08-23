import { getKasMusholla } from '@/app/actions/kas'
import Link from 'next/link'

export default async function KasMushollaPage() {
  const transaksi = await getKasMusholla()

  const totalPemasukan = transaksi
    .filter(t => t.jenis === 'PEMASUKAN')
    .reduce((acc, curr) => acc + Number(curr.jumlah), 0)
    
  const totalPengeluaran = transaksi
    .filter(t => t.jenis === 'PENGELUARAN')
    .reduce((acc, curr) => acc + Number(curr.jumlah), 0)
    
  const saldoAkhir = totalPemasukan - totalPengeluaran

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kas Musholla</h2>
          <p className="text-gray-600 text-sm">Kelola pemasukan dan pengeluaran kas rutin.</p>
        </div>
        <Link 
          href="/dashboard/kas/tambah" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
        >
          + Tambah Transaksi
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Pemasukan</div>
          <div className="text-xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Pengeluaran</div>
          <div className="text-xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 bg-emerald-50">
          <div className="text-gray-600 text-sm font-bold mb-1">Saldo Akhir</div>
          <div className="text-2xl font-bold text-primary">{formatRupiah(saldoAkhir)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan / Pihak</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data transaksi.
                  </td>
                </tr>
              ) : (
                transaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{t.keterangan}</div>
                      <div className="text-xs text-gray-500">Pihak: {t.pihak_terkait}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                        {t.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        t.jenis === 'PEMASUKAN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {t.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{t.metode}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                        t.jenis === 'PEMASUKAN' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {t.jenis === 'PEMASUKAN' ? '+' : '-'}{formatRupiah(Number(t.jumlah))}
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
