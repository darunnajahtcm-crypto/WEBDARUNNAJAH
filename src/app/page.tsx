import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // 1. Fetch Kas Musholla
  const { data: kasData } = await supabase.from('kas_musholla').select('jenis, jumlah').eq('status', 'PUBLISHED')
  const totalKasPemasukan = (kasData || []).filter(k => k.jenis === 'PEMASUKAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  const totalKasPengeluaran = (kasData || []).filter(k => k.jenis === 'PENGELUARAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  const saldoKas = totalKasPemasukan - totalKasPengeluaran

  // 2. Fetch Dana Rukem & Total Anggota
  const { data: rukemDana } = await supabase.from('rukem_transaksi').select('jumlah')
  const totalRukem = (rukemDana || []).reduce((acc, curr) => acc + Number(curr.jumlah), 0)
  
  const { count: pesertaRukem } = await supabase.from('rukem_anggota').select('*', { count: 'exact', head: true }).eq('status_anggota', true)

  // 3. Fetch PHBI Aktif
  const { data: phbiAktif } = await supabase.from('phbi_kegiatan').select('id, nama').eq('status_kegiatan', 'AKTIF').order('created_at', { ascending: false }).limit(1).single()
  
  let saldoPHBI = 0
  if (phbiAktif) {
    const { data: phbiTrans } = await supabase.from('phbi_transaksi')
      .select('jenis, jumlah')
      .eq('kegiatan_id', phbiAktif.id)
      .eq('status_approval', 'PUBLISHED')
      
    const phbiMasuk = (phbiTrans || []).filter(t => t.jenis === 'PEMASUKAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
    const phbiKeluar = (phbiTrans || []).filter(t => t.jenis === 'PENGELUARAN').reduce((acc, curr) => acc + Number(curr.jumlah), 0)
    saldoPHBI = phbiMasuk - phbiKeluar
  }

  // 4. Fetch Pengumuman
  const { data: pengumumanListData } = await supabase
    .from('pengumuman')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('tanggal', { ascending: false })
    .limit(4)
    
  const pengumumanList = pengumumanListData || []

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
  }

  // Waktu Sholat dummy (Untuk jadwal sholat dinamis asli perlu pakai API jadwal sholat Kemenag/Aladhan)
  const jadwalSholat = [
    { nama: 'Subuh', waktu: '04:47' },
    { nama: 'Dzuhur', waktu: '12:05' },
    { nama: 'Ashar', waktu: '15:28' },
    { nama: 'Maghrib', waktu: '17:54' },
    { nama: 'Isya', waktu: '19:06' },
  ]

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white rounded-br-[4rem] md:rounded-br-[8rem] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              MUSHOLLA<br />
              DARUN NAJAH
            </h1>
            <h2 className="text-xl md:text-2xl text-emerald-100">Tenjo City Metropolis</h2>
            <p className="text-lg italic text-emerald-50 border-l-4 border-accent pl-4 py-1">
              "Bersama Memakmurkan Musholla dan Membangun Kebersamaan Warga"
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/kegiatan" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Lihat Kegiatan
              </Link>
              <Link href="/donasi" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center gap-2 shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Donasi Sekarang
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 w-full mt-8 md:mt-0 flex justify-center">
             <div className="w-full max-w-md aspect-square bg-emerald-800 rounded-full border-4 border-white overflow-hidden relative shadow-2xl flex items-center justify-center text-emerald-200">
                <Image src="/logo.png" alt="Hero Logo" width={200} height={200} className="opacity-50" />
             </div>
          </div>
        </div>
        
        {/* Silhouette decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-1/2 h-full">
           <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-white" preserveAspectRatio="none">
             <path d="M50 100 L50 40 Q 50 10 70 10 T 90 40 L90 100 Z" />
           </svg>
        </div>
      </section>

      {/* Jadwal Sholat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex items-center gap-4 text-primary font-bold text-xl">
             <div className="bg-emerald-50 p-3 rounded-lg">
               <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             JADWAL SHOLAT HARI INI
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full md:w-auto">
             {jadwalSholat.map(sholat => (
               <div key={sholat.nama} className="bg-surface px-4 py-2 rounded-lg text-center flex-1 min-w-[70px]">
                 <div className="text-xs text-gray-600 font-medium mb-1">{sholat.nama}</div>
                 <div className="font-bold text-sm sm:text-lg text-primary">{sholat.waktu}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Informasi & Agenda Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              INFORMASI TERBARU
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {pengumumanList.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-gray-100">
                  Belum ada informasi terbaru.
                </div>
              ) : (
                pengumumanList.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="text-xs text-gray-500 mb-2">{new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <h4 className="font-bold text-gray-800 mb-2">{p.judul}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.konten}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              AGENDA TERDEKAT
            </h3>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 divide-y divide-gray-100">
              <div className="py-3 flex gap-4">
                <div className="bg-surface text-primary p-2 rounded text-center min-w-[50px]">
                  <div className="font-bold text-lg">23</div>
                  <div className="text-xs uppercase">Agu</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Kajian Ahad Pagi</h4>
                  <div className="text-xs text-gray-500 mt-1">07.00 - Selesai</div>
                </div>
              </div>
              <div className="py-3 flex gap-4">
                <div className="bg-surface text-primary p-2 rounded text-center min-w-[50px]">
                  <div className="font-bold text-lg">28</div>
                  <div className="text-xs uppercase">Agu</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Pengajian Warga</h4>
                  <div className="text-xs text-gray-500 mt-1">19.30 - Selesai</div>
                </div>
              </div>
              <div className="pt-4 text-center">
                <Link href="/kegiatan" className="text-primary text-sm font-semibold hover:underline">Lihat Semua Agenda &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keuangan Section (Dinamis dari Database) */}
      <section className="bg-surface py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-2 justify-center text-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            TRANSPARANSI KEUANGAN MUSHOLLA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KAS MUSHOLLA */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-primary overflow-hidden flex flex-col">
              <div className="p-6 text-center flex-1">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase">Kas Musholla</h4>
                <p className="text-xs text-gray-500 mb-3">Saldo Tersedia</p>
                <div className="text-2xl font-bold text-primary">{formatRupiah(saldoKas)}</div>
              </div>
              <Link href="/keuangan/kas" className="bg-primary text-white text-center py-3 text-sm font-semibold hover:bg-emerald-800 transition">
                Lihat Detail &rarr;
              </Link>
            </div>

            {/* DANA RUKEM */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-accent overflow-hidden flex flex-col">
              <div className="p-6 text-center flex-1">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase">Dana Rukem</h4>
                <p className="text-xs text-gray-500 mb-3">Dana Terkumpul</p>
                <div className="text-2xl font-bold text-accent">{formatRupiah(totalRukem)}</div>
              </div>
              <Link href="/keuangan/rukem" className="bg-accent text-white text-center py-3 text-sm font-semibold hover:bg-yellow-600 transition">
                Lihat Detail &rarr;
              </Link>
            </div>

            {/* PESERTA RUKEM */}
            <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-500 overflow-hidden flex flex-col">
              <div className="p-6 text-center flex-1">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase">Peserta Rukem</h4>
                <p className="text-xs text-gray-500 mb-3">Total KK Terdaftar</p>
                <div className="text-2xl font-bold text-blue-600">{pesertaRukem || 0} Keluarga</div>
              </div>
              <Link href="/keuangan/rukem" className="bg-blue-600 text-white text-center py-3 text-sm font-semibold hover:bg-blue-700 transition">
                Lihat Detail &rarr;
              </Link>
            </div>

            {/* KEUANGAN PHBI (Hanya Tampil Jika Ada Kegiatan Aktif) */}
            {phbiAktif && (
              <div className="bg-white rounded-xl shadow-md border-t-4 border-purple-500 overflow-hidden flex flex-col">
                <div className="p-6 text-center flex-1">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1 uppercase">Keuangan {phbiAktif.nama.substring(0,10)}...</h4>
                  <p className="text-xs text-gray-500 mb-3">Saldo Sementara</p>
                  <div className="text-2xl font-bold text-purple-600">{formatRupiah(saldoPHBI)}</div>
                </div>
                <Link href={`/keuangan/phbi/${phbiAktif.id}`} className="bg-purple-600 text-white text-center py-3 text-sm font-semibold hover:bg-purple-700 transition">
                  Lihat Detail &rarr;
                </Link>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">* Klik pada masing-masing kartu untuk melihat detail laporan transparansi.</p>
        </div>
      </section>
    </div>
  );
}
