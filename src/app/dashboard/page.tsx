export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang di Sistem Manajemen!</h2>
        <p className="text-gray-600">
          Gunakan menu di sebelah kiri untuk mengelola kas, kegiatan, dan pengaturan website Musholla Darun Najah.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-primary">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Kas Musholla</div>
          <div className="text-2xl font-bold text-gray-800">Rp 0</div>
          <div className="text-xs text-green-600 mt-2 font-medium">+ Pemasukan Bulan Ini: Rp 0</div>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-accent">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Dana Rukem</div>
          <div className="text-2xl font-bold text-gray-800">Rp 0</div>
          <div className="text-xs text-gray-500 mt-2 font-medium">0 Anggota Terdaftar</div>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-purple-500">
          <div className="text-gray-500 text-sm font-medium mb-1">Kas Kegiatan PHBI</div>
          <div className="text-2xl font-bold text-gray-800">Rp 0</div>
          <div className="text-xs text-yellow-600 mt-2 font-medium">0 Transaksi Menunggu Review</div>
        </div>
        
        {/* Stat Card 4 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-blue-500">
          <div className="text-gray-500 text-sm font-medium mb-1">Pengumuman Aktif</div>
          <div className="text-2xl font-bold text-gray-800">0</div>
          <div className="text-xs text-gray-500 mt-2 font-medium">Tampil di Website Publik</div>
        </div>
      </div>
    </div>
  )
}
