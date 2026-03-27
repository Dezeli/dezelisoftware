// front/src/pages/PostDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import MarkdownRenderer from '../components/MarkdownRenderer' // 추가

export default function PostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/posts/${id}`)
                const data = response.data || response
                setPost(data)
            } catch (err) {
                setError('블로그 글을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchPostDetail()
        window.scrollTo(0, 0)
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center py-60">
            <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
            </div>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center py-40 text-red-400 text-sm font-mono font-['Pretendard']">
            {error}
        </div>
    )

    if (!post) return null

    return (
        <div className="w-full space-y-12 font-['Pretendard']">

            <button
                onClick={() => navigate('/posts')}
                className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-all font-['NanumBarunPen'] group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to Blog
            </button>

            <header className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
                    <span className="px-3 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-md text-[10px] font-mono uppercase tracking-widest">
                        {post.category?.name}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                        {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white font-['NanumBarunPen'] leading-[1.2] tracking-tight">
                    {post.title}
                </h1>
            </header>

            {/* 마크다운 렌더링 영역: dangerouslySetInnerHTML 제거 및 컴포넌트 교체 // 수정 */}
            <article className="mt-4 markdown-body">
                <MarkdownRenderer content={post.content} />
            </article>

            {(post.previous_posts?.length > 0 || post.next_posts?.length > 0) && (
                <div className="pt-12 space-y-8">
                    <div className="h-px bg-zinc-800/60" />
                    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-['NanumBarunPen']">
                        {post.previous_posts?.[0] ? (
                            <Link
                                to={`/posts/${post.previous_posts[0].id}`}
                                className="group block p-6 bg-zinc-900/40 border-2 border-zinc-800 hover:border-emerald-500/40 rounded-3xl transition-all"
                            >
                                <div className="flex justify-between items-center mb-1.5">
                                    <p className="text-[13px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
                                        PREVIOUS
                                    </p>
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        {new Date(post.previous_posts[0].created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                
                                <h4 className="text-xl font-bold text-zinc-200 group-hover:text-white leading-snug font-['Pretendard']">
                                    <span className="inline-block align-middle mr-2 px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded text-[9px] font-mono uppercase tracking-tighter mb-1">
                                        {post.previous_posts[0].category?.name}
                                    </span>
                                    {post.previous_posts[0].title}
                                </h4>
                            </Link>
                        ) : <div />}

                        {post.next_posts?.[0] ? (
                            <Link
                                to={`/posts/${post.next_posts[0].id}`}
                                className="group block p-6 bg-zinc-900/40 border-2 border-zinc-800 hover:border-cyan-500/40 rounded-3xl transition-all"
                            >
                                <div className="flex justify-between items-center mb-1.5 flex-row-reverse">
                                    <p className="text-[13px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1.5">
                                        NEXT 
                                        <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                    </p>
                                    <span className="text-[10px] font-mono text-zinc-600">
                                        {new Date(post.next_posts[0].created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                
                                <h4 className="text-xl font-bold text-zinc-200 group-hover:text-white leading-snug font-['Pretendard']">
                                    <span className="inline-block align-middle mr-2 px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded text-[9px] font-mono uppercase tracking-tighter mb-1">
                                        {post.next_posts[0].category?.name}
                                    </span>
                                    {post.next_posts[0].title}
                                </h4>
                            </Link>
                        ) : <div />}
                    </nav>
                </div>
            )}
        </div>
    )
}