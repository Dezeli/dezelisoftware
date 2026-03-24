// front/src/pages/PostList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'

export default function PostList() {
    const [posts, setPosts] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories')
                const data = response.data || response
                setCategories(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('카테고리 로딩 실패', err)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                let url = `/posts?page=${page}`
                if (selectedCategory) url += `&category=${selectedCategory}`
                const response = await axiosInstance.get(url)
                const data = response.data || response
                setPosts(data.items || [])
                setTotalCount(data.count || 0)
                setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 9)))
            } catch (err) {
                setError('블로그 글 목록을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [selectedCategory, page])

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName)
        setPage(1)
    }

    if (error) return (
        <div className="flex items-center justify-center py-40 text-red-400 text-sm font-mono font-['Pretendard']">
            {error}
        </div>
    )

    return (
        <div className="space-y-6 font-['Pretendard']">
            {/* 1. 상단 라인: 제목 + 필터 버튼 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-['NanumBarunPen']">Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-['NanumBarunPen']">
                        기술 블로그
                    </h1>
                </div>

                <div className="flex items-center gap-2 font-['NanumBarunPen']">
                    <button
                        onClick={() => handleCategoryClick('')}
                        className={`px-4 py-2 rounded-xl text-base font-bold transition-all border-2
                            ${selectedCategory === ''
                                ? 'bg-emerald-500 border-emerald-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                    >
                        전체보기
                    </button>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 bg-zinc-900 border-2 rounded-xl text-base font-bold transition-all
                            ${showFilters || selectedCategory !== '' ? 'border-emerald-500/50 text-emerald-400' : 'border-zinc-800 text-zinc-400'}`}
                    >
                        <svg className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                        {selectedCategory ? selectedCategory : '카테고리 필터링'}
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="flex flex-wrap justify-end gap-2 font-['NanumBarunPen'] animate-in fade-in slide-in-from-right-4 duration-300">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.name)}
                            className={`px-4 py-1 rounded-xl text-base font-bold transition-all border-2 
                                ${selectedCategory === category.name
                                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 bg-transparent'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex justify-end py-3 border-b border-zinc-800/50 font-['NanumBarunPen']">
                <div className="text-base font-bold text-zinc-400 px-1">
                    글 총 <span className="text-emerald-400">{posts.length}</span> / {totalCount}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-zinc-800/60 border-b border-zinc-800/60">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/posts/${post.id}`}
                            className="group flex items-center justify-between gap-4 py-5 hover:bg-zinc-800/60 -mx-4 px-4 rounded-2xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-6 min-w-0 flex-1">
                                <div className="hidden sm:flex w-16 shrink-0 justify-start"> 
                                    <span className="w-full text-center px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 group-hover:border-cyan-500/40 text-zinc-500 group-hover:text-cyan-400 rounded-md text-[9px] font-mono transition-all truncate">
                                        {post.category.name}
                                    </span>
                                </div>
                                <span className="text-base md:text-lg font-semibold text-zinc-200 group-hover:text-white font-['Pretendard'] truncate transition-colors">
                                    {post.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 shrink-0">
                                <span className="text-[11px] font-mono text-zinc-600 group-hover:text-zinc-300 transition-colors">
                                    {new Date(post.created_at).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                </span>
                                <span className="text-zinc-800 group-hover:text-emerald-400 transition-all group-hover:translate-x-1">
                                    →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* 5. 페이지네이션 */}
            {!loading && (
                <div className="flex items-center justify-center gap-2 pt-16 font-['NanumBarunPen']">
                    <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-2 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 rounded-xl hover:text-white disabled:opacity-30 transition-all">
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
                                <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600 font-mono">…</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => setPage(item)}
                                    className={`w-10 h-10 rounded-xl text-lg font-bold transition-all border-2
                                        ${page === item
                                            ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                                        }`}
                                >
                                    {item}
                                </button>
                            )
                        )
                    }
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-2 bg-zinc-900 border-2 border-zinc-800 text-zinc-400 rounded-xl hover:text-white disabled:opacity-30 transition-all">
                        »
                    </button>
                </div>
            )}
        </div>
    )
}