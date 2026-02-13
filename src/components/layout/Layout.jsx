import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { isDark } = useTheme();

    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        return path || 'dashboard';
    };

    return (
        <div className={`min-h-screen overflow-x-hidden relative selection:bg-primary selection:text-white transition-colors duration-300 ${isDark ? 'bg-background-dark text-white' : 'bg-[#f1f5f9] text-slate-900'}`}>
            {/* Ambient Background Glows - Only in dark mode */}
            {isDark && (
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[140px] mix-blend-screen"></div>
                    <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
                </div>
            )}

            {/* Light mode subtle gradient background */}
            {!isDark && (
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
                </div>
            )}

            <div className="flex h-screen w-full relative">
                <Sidebar isOpen={sidebarOpen} />

                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <Header title={getPageTitle()} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 scroll-smooth">
                        <Outlet />
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
