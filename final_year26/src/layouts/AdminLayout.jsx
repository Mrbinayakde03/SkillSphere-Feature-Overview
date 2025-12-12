import { useState } from 'react';
import { Header } from '../components/shared/Header';
import { Sidebar } from '../components/shared/Sidebar';
import { Footer } from '../components/shared/Footer';

export function AdminLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} onLogout={onLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
