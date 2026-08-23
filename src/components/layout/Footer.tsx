import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4 bg-white p-2 rounded-lg inline-flex">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-auto h-10" />
              <div className="flex flex-col text-primary">
                <span className="font-bold text-sm leading-tight uppercase">Musholla</span>
                <span className="font-extrabold text-base leading-tight uppercase">Darun Najah</span>
              </div>
            </div>
            <p className="text-emerald-100 text-sm mt-4">
              "Bersama Memakmurkan Musholla dan Membangun Kebersamaan Warga"
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">MENU</h3>
            <ul className="space-y-2 text-emerald-100 text-sm">
              <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
              <li><Link href="/profil" className="hover:text-white transition">Profil</Link></li>
              <li><Link href="/kegiatan" className="hover:text-white transition">Kegiatan</Link></li>
              <li><Link href="/keuangan" className="hover:text-white transition">Keuangan</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">LINK CEPAT</h3>
            <ul className="space-y-2 text-emerald-100 text-sm">
              <li><Link href="/#jadwal" className="hover:text-white transition">Jadwal Sholat</Link></li>
              <li><Link href="/#agenda" className="hover:text-white transition">Agenda</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition">Galeri Kegiatan</Link></li>
              <li><Link href="/donasi" className="hover:text-white transition">Donasi</Link></li>
              <li><Link href="/pengumuman" className="hover:text-white transition">Pengumuman</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">HUBUNGI KAMI</h3>
            <ul className="space-y-3 text-emerald-100 text-sm">
              <li className="flex gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Cilaku, Tenjo City Metropolis, Kab. Bogor, Jawa Barat</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>08xx-xxxx-xxxx</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>info@darunnajah.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-emerald-200 text-sm">
          <p>&copy; {new Date().getFullYear()} Musholla Darun Najah. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
