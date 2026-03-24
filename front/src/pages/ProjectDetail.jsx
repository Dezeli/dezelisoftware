// front/src/pages/ProjectDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'

export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchProjectDetail = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/projects/${id}`)
                const resData = response.data.data || response.data || response
                setProject(resData)
            } catch (err) {
                setError('프로젝트 정보를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchProjectDetail()
        window.scrollTo(0, 0)
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center py-60">
            <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
            </div>
        </div>
    )

    if (error || !project) return <div className="text-center py-40 text-red-400 font-mono font-['Pretendard']">{error || '데이터 없음'}</div>

    return (
        <div className="max-w-2xl mx-auto space-y-12 font-['Pretendard']">
            {/* 1. 상단 네비게이션 */}
            <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-emerald-400 transition-all font-mono group uppercase tracking-widest">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Project
            </button>

            {/* 2. 헤더 섹션 */}
            <header className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-emerald-900/50 pb-4">
                    <span className="text-sm font-bold font-mono text-emerald-500 tracking-tight">
                        {formatDate(project.start_date)} — {project.end_date ? formatDate(project.end_date) : 'PRESENT'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {project.tech_stacks?.map(stack => (
                            <span key={stack.id} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded text-[9px] font-mono">
                                {stack.name}
                            </span>
                        ))}
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-['NanumBarunPen'] leading-tight tracking-tight">
                    {project.title}
                </h1>
            </header>

            {/* 3. 썸네일: 중앙 정렬 수정 // 수정 */}
            {project.thumbnail && (
                <div className="flex justify-center"> 
                    <div className="max-w-md w-full aspect-video rounded-3xl overflow-hidden border-4 border-cyan-900 bg-zinc-900 shadow-2xl mx-auto"> {/* mx-auto 추가 */}
                        <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                        />
                    </div>
                </div>
            )}

            {/* 4. 설명 및 링크 */}
            <article className="space-y-8">
                <div className="bg-emerald-950/20 border-l-4 border-emerald-500 p-8 rounded-r-2xl">
                    <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                        {project.description}
                    </p>
                </div>

                {project.github_url && (
                    <div className="pt-2">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center justify-center gap-3 p-4 bg-zinc-950 border-2 border-emerald-900/50 hover:border-emerald-500 rounded-2xl text-emerald-500/80 hover:text-white transition-all group shadow-xl">
                            <svg className="w-5 h-5 fill-current opacity-70 group-hover:opacity-100" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            <span className="text-sm font-medium tracking-wide">Source Code on GitHub ↗</span>
                        </a>
                    </div>
                )}
            </article>

            {/* 5. 이전 / 다음 네비게이션: 기술 스택 + 날짜 포함 // 수정 */}
            {(project.previous_projects?.length > 0 || project.next_projects?.length > 0) && (
                <div className="space-y-8">
                    <div className="h-px bg-zinc-800/60" />
                    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-['NanumBarunPen']">
                        {project.previous_projects?.[0] ? (
                            <Link to={`/projects/${project.previous_projects[0].id}`} className="group block p-6 bg-zinc-900/40 border-2 border-zinc-800 hover:border-emerald-500/40 rounded-3xl transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <span className="group-hover:-translate-x-1 transition-transform">←</span> PREV
                                    </p>
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        {formatDate(project.previous_projects[0].start_date)}
                                        {project.previous_projects[0].end_date 
                                            ? ` — ${formatDate(project.previous_projects[0].end_date)}` 
                                            : ' — Present'}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-200 group-hover:text-white leading-tight font-['Pretendard']">
                                    <div className="flex flex-wrap gap-1 mb-1.5">
                                        {project.previous_projects[0].tech_stacks?.slice(0, 2).map(s => (
                                            <span key={s.id} className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-[4px] text-[8px] font-mono uppercase tracking-tighter">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                    {project.previous_projects[0].title}
                                </h4>
                            </Link>
                        ) : <div />}

                        {project.next_projects?.[0] ? (
                            <Link to={`/projects/${project.next_projects[0].id}`} className="group block p-6 bg-zinc-900/40 border-2 border-zinc-800 hover:border-cyan-500/40 rounded-3xl transition-all">
                                <div className="flex justify-between items-center mb-2 flex-row-reverse">
                                    <p className="text-[12px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1">
                                        NEXT <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </p>
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        {formatDate(project.next_projects[0].start_date)}
                                        {project.next_projects[0].end_date 
                                            ? ` — ${formatDate(project.next_projects[0].end_date)}` 
                                            : ' — Present'}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-200 group-hover:text-white leading-tight font-['Pretendard'] text-right">
                                    <div className="flex flex-wrap gap-1 mb-1.5 justify-end">
                                        {project.next_projects[0].tech_stacks?.slice(0, 2).map(s => (
                                            <span key={s.id} className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-[4px] text-[8px] font-mono uppercase tracking-tighter">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                    {project.next_projects[0].title}
                                </h4>
                            </Link>
                        ) : <div />}
                    </nav>
                </div>
            )}
        </div>
    )
}