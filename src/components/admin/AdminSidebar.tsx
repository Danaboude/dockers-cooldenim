'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  SquaresFour,
  Image as ImageIcon,
  GridFour,
  Package,
  SignOut,
  List,
  X,
} from '@phosphor-icons/react';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: SquaresFour },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/categories', label: 'Categories', icon: GridFour },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <Image src="/cool&denim.png" alt="Cool & Denim" width={36} height={36} className="object-contain h-9 w-auto" />
        <div>
          <p className="font-bold text-navy text-sm leading-tight">Cool &amp; Denim</p>
          <p className="text-xs text-muted">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-navy text-white'
                  : 'text-muted hover:bg-off-white hover:text-navy'
              }`}
            >
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <SignOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-border min-h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <Image src="/cool&denim.png" alt="Cool & Denim" width={28} height={28} className="object-contain h-7 w-auto" />
          <span className="font-bold text-navy text-sm">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-navy">
          {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white h-full shadow-xl">
            <div className="pt-14">
              <SidebarContent />
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
