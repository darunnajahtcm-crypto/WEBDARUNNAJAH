'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header({ hasSession = false }: { hasSession?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={50} height={50} className="w-auto h-12" />
                <div className="flex flex-col">
                  <span className="font-bold text-primary text-lg leading-tight uppercase">Musholla</span>
                  <span className="font-extrabold text-primary text-xl leading-tight uppercase">Darun Najah</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium px-3 py-2">Beranda</Link>
            <Link href="/profil" className="text-gray-700 hover:text-primary font-medium px-3 py-2">Profil</Link>
            <Link href="/kegiatan" className="text-gray-700 hover:text-primary font-medium px-3 py-2">Kegiatan</Link>
            <Link href="/keuangan" className="text-gray-700 hover:text-primary font-medium px-3 py-2">Keuangan</Link>
            <Link href="/kontak" className="text-gray-700 hover:text-primary font-medium px-3 py-2">Kontak</Link>
          </nav>

          {/* Login / Dashboard Button */}
          <div className="hidden md:flex items-center">
            {hasSession ? (
              <Link href="/dashboard" className="bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full font-semibold hover:bg-emerald-200 transition border border-emerald-200 shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                DASHBOARD
              </Link>
            ) : (
              <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-800 transition">
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Beranda</Link>
            <Link href="/profil" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Profil</Link>
            <Link href="/kegiatan" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Kegiatan</Link>
            <Link href="/keuangan" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Keuangan</Link>
            <Link href="/kontak" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Kontak</Link>
            
            {hasSession ? (
              <Link href="/dashboard" className="block px-3 py-2 text-base font-bold text-emerald-800 bg-emerald-100 rounded-md mt-4 border border-emerald-200">Buka Dashboard</Link>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-base font-medium text-primary bg-emerald-50 rounded-md mt-4">Login Admin</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
