import Link from 'next/link'

export default function KeuanganPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Keuangan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/keuangan/kas" className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold text-emerald-800 mb-2">Kas Musholla</h2>
          <p className="text-gray-600">Lihat transparansi uang kas masuk dan keluar.</p>
        </Link>
        <Link href="/keuangan/rukem" className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold text-emerald-800 mb-2">Iuran Rukun Kematian (Rukem)</h2>
          <p className="text-gray-600">Lihat transparansi iuran bulanan warga.</p>
        </Link>
      </div>
    </div>
  )
}
