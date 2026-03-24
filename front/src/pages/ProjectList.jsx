// front/src/pages/ProjectList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'

export default function ProjectList() {
    const [projects, setProjects] = useState([])
    const [skills, setSkills] = useState([])
    const [selectedSkill, setSelectedSkill] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilters, setShowFilters] = useState(false)

    // 날짜 포맷팅 함수 // 추가
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axiosInstance.get('/skills')
                const data = response.data.data || response.data || response // API 구조에 맞춰 수정
                setSkills(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('기술 스택 로딩 실패', err)
            }
        }
        fetchSkills()
    }, [])

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            try {
                let url = `/projects?page=${page}`
                if (selectedSkill) url += `&skill=${selectedSkill}`
                const response = await axiosInstance.get(url)
                const resData = response.data.data || response.data || response // API 구조에 맞춰 수정
                setProjects(resData.items || [])
                setTotalPages(Math.max(1, Math.ceil((resData.count || 0) / 9)))
            } catch (err) {
                setError('프로젝트 목록을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [selectedSkill, page])

    const handleSkillClick = (skillName) => {
        setSelectedSkill(skillName)
        setPage(1)
    }

    if (error) return (
        <div className="flex items-center justify-center py-40 text-red-400 text-sm font-mono font-['Pretendard']">
            {error}
        </div>
    )

    return (
        <div className="font-['Pretendard']">
            {/* 1. 헤더 섹션 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-['NanumBarunPen']">Projects</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-['NanumBarunPen']">
                        개발 아카이브
                    </h1>
                </div>

                <div className="flex items-center gap-2 font-['NanumBarunPen']">
                    <button
                        onClick={() => handleSkillClick('')}
                        className={`px-4 py-2 rounded-xl text-base font-bold transition-all border-2
                            ${selectedSkill === ''
                                ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                    >
                        전체보기
                    </button>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 bg-zinc-900 border-2 rounded-xl text-base font-bold transition-all
                            ${showFilters || selectedSkill !== '' ? 'border-emerald-500/50 text-emerald-400' : 'border-zinc-800 text-zinc-400'}`}
                    >
                        <svg className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {selectedSkill ? selectedSkill : '스택 필터링'}
                    </button>
                </div>
            </div>

            {/* 2. 필터 목록 */}
            <div className={`flex flex-wrap justify-end gap-2 font-['NanumBarunPen'] pt-4 pb-4 transition-all duration-300
                ${showFilters 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                }`}
            >
                {skills.map(skill => (
                    <button
                        key={skill.id}
                        onClick={() => handleSkillClick(skill.name)}
                        className={`px-4 py-1 rounded-xl text-base font-bold transition-all border-2 
                            ${selectedSkill === skill.name
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 bg-transparent'
                            }`}
                    >
                        {skill.name}
                    </button>
                ))}
            </div>

            {/* 3. 프로젝트 리스트 */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20 pt-4">
                    {projects.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group relative flex flex-col"
                        >
                            <div className="relative aspect-[4/3.7] w-full rounded-3xl overflow-hidden border-4 border-cyan-900 bg-zinc-900 z-0 shadow-lg group-hover:border-cyan-500 transition-all duration-300">
                                {project.thumbnail ? (
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-['NanumBarunPen'] text-zinc-700 text-xl bg-zinc-950">
                                        NO PREVIEW
                                    </div>
                                )}
                            </div>

                            <div className="absolute -bottom-10 -right-2 w-[94%] bg-emerald-950 border-4 border-emerald-900 p-4 rounded-2xl shadow-xl z-10 transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:border-emerald-500 backdrop-blur-md">
                                <div className="flex flex-col px-0.5">
                                    {/* 작업 기간 표시 섹션 // 추가 */}
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-[9px] font-bold font-mono tracking-tighter text-emerald-500/60 uppercase">
                                            {formatDate(project.start_date)} — {project.end_date ? formatDate(project.end_date) : 'Present'}
                                        </span>
                                        {!project.end_date && (
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-base md:text-lg font-semibold text-white font-['Pretendard'] leading-tight tracking-tight">
                                            {project.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {project.tech_stacks?.slice(0, 3).map(stack => (
                                            <span key={stack.id} className="px-1.5 py-0.5 bg-zinc-950 border border-emerald-900/40 text-emerald-400/80 rounded text-[9px] font-mono font-bold">
                                                {stack.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                        <p className="text-[10px] text-emerald-100/60 font-medium leading-relaxed mt-2 group-hover:text-emerald-50 transition-colors">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* 4. 페이지네이션 */}
            {!loading && (
                <div className="flex items-center justify-center gap-2 pt-28 font-['NanumBarunPen']">
                    <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-2 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 rounded-xl hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono">
                        «
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => {
                            if (totalPages <= 5) return true
                            if (p === 1 || p === totalPages) return true
                            if (Math.abs(p - page) <= 1) return true
                            return false
                        })
                        .reduce((acc, p, idx, arr) => {
                            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                            acc.push(p)
                            return acc
                        }, [])
                        .map((item, idx) =>
                            item === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600">…</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => setPage(item)}
                                    className={`w-10 h-10 rounded-xl text-lg font-bold transition-all border-2
                                        ${page === item
                                            ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-md'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white'
                                        }`}
                                >
                                    {item}
                                </button>
                            )
                        )
                    }
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-2 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 rounded-xl hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono">
                        »
                    </button>
                </div>
            )}
        </div>
    )
}