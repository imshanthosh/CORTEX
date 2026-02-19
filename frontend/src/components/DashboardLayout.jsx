/**
 * DashboardLayout — Shell for all authenticated pages.
 * Fixed sidebar (desktop 280px) + top navbar + scrollable padded content.
 */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0b1120]">
            {/* Sidebar — 280px wide on desktop */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Right column: navbar + page content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} />

                {/* Scrollable content area with generous desktop padding */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 xl:px-12 py-8 pb-16">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
