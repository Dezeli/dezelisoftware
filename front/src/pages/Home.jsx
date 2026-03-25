// front/src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import MarkdownRenderer from '../components/MarkdownRenderer' // 수정

export default function Home() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/profile')
                const data = response.data || response
                setProfile(data)
            } catch (err) {
                setError('데이터 로드 실패')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center py-60">
            <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
            </div>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center py-60 text-red-400 text-sm font-mono">
            {error}
        </div>
    )

    if (!profile) return null

    return (
        <div className="space-y-24 font-['Pretendard']">
            <section className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 pt-4">

                <div className="flex flex-col gap-8 w-full md:w-3/5 text-center md:text-left">
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-5"> 
                            {profile.logo_image && (
                                <img
                                    src={profile.logo_image}
                                    alt="logo"
                                    className="w-24 h-24 rounded-2xl object-contain bg-zinc-900 border-2 border-zinc-700 p-2 shadow-xl shrink-0"
                                />
                            )}
                            <div className="flex items-center">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-['NanumBarunPen'] leading-none">
                                    {profile.name}
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-xl font-['Pretendard']">
                            {profile.slogan}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2.5 justify-center md:justify-start">
                            <svg className="w-5 h-5 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <span className="text-base font-mono text-zinc-400">
                                {profile.contact_email}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start font-['NanumBarunPen']">
                            <Link to="/projects" className="px-7 py-3 bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold rounded-2xl hover:bg-emerald-500/10 transition-all duration-300">
                                Projects →
                            </Link>
                            <Link to="/posts" className="px-7 py-3 bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold rounded-2xl hover:bg-emerald-500/10 transition-all duration-300">
                                Blog →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 shrink-0 flex justify-center md:justify-end">
                    {profile.profile_image && (
                        <div className="relative aspect-square w-full max-w-[280px] rounded-3xl bg-zinc-900 border-2 border-zinc-700 shadow-2xl overflow-hidden md:mt-2"> 
                            <img
                                src={profile.profile_image}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />
                        </div>
                    )}
                </div>
            </section>

            <section className="font-['Pretendard']">
                <div className="flex items-center gap-3 mb-8 font-['NanumBarunPen']">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">About</span>
                </div>
                {/* 렌더링 방식만 변경 // 수정 */}
                <div className="pl-6 border-l-2 border-zinc-800 markdown-body"> 
                    <MarkdownRenderer content={profile.introduction} />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-8 font-['NanumBarunPen']">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {profile.skills?.map((skill) => (
                        <span
                            key={skill.id}
                            className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-full text-base font-medium transition-all duration-300"
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </section>

        </div>
    )
}