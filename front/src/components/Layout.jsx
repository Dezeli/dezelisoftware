// front/src/components/Layout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
    const location = useLocation()

    const navLinks = [
        { to: '/projects', label: 'Projects' },
        { to: '/posts', label: 'Blog' },
    ]

    const isActive = (path) => location.pathname.startsWith(path)

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-['Pretendard']">

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 border-b-2 border-zinc-600/50">
                    <div className="max-w-3xl mx-auto flex justify-between items-center py-4">
                        <Link to="/" className="flex items-baseline gap-0.5 hover:opacity-80 transition-opacity duration-200 font-['NanumBarunPen']"> {/* 추가 */}
                            <span className="font-black text-xl text-white tracking-tight">dezeli</span>
                            <span className="font-extrabold text-xl text-emerald-400 tracking-tight">.dev</span>
                        </Link>

                        <div className="flex items-center gap-1">
                            {navLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`px-4 py-2 text-sm font-bold rounded-2xl transition-all duration-200 font-['NanumBarunPen']
                                        ${isActive(to)
                                            ? 'bg-zinc-800 text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-3xl mx-auto px-6 py-16">
                <Outlet />
            </main>

            <footer className="relative mt-8">
                <div className="max-w-4xl mx-auto px-6 border-t-2 border-zinc-600/50">
                    <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 py-8">
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 font-['NanumBarunPen']">
                            <a
                                href="https://github.com/dezeli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors duration-200"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                github.com/dezeli
                            </a>
                            <span className="text-zinc-600">·</span>
                            <a
                                className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors duration-200"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                haterecursive@gmail.com
                            </a>
                        </div>
                        <span className="text-xs font-mono text-zinc-600">
                            © {new Date().getFullYear()} dezeli. All rights reserved.
                        </span>
                    </div>
                </div>
            </footer>

        </div>
    )
}