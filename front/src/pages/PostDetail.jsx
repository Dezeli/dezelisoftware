// front/src/pages/PostDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'

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
                if (response.success) {
                    setPost(response.data)
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError('블로그 글을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchPostDetail()
    }, [id])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error}</div>
    if (!post) return <div>데이터가 없습니다.</div>

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/posts')} style={{ marginBottom: '20px' }}>
                목록으로 돌아가기
            </button>

            <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>
            
            <div style={{ display: 'flex', gap: '15px', color: '#666', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{post.category.name}</span>
                <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
            </div>

            <div 
                style={{ lineHeight: '1.6', fontSize: '1.1em', marginBottom: '50px' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <hr style={{ margin: '40px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {post.previous_posts && post.previous_posts.length > 0 && (
                        <>
                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#666' }}>이전 글</p>
                            {post.previous_posts.map(prev => (
                                <Link key={prev.id} to={`/posts/${prev.id}`}>
                                    - {prev.title}
                                </Link>
                            ))}
                        </>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
                    {post.next_posts && post.next_posts.length > 0 && (
                        <>
                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#666' }}>다음 글</p>
                            {post.next_posts.map(next => (
                                <Link key={next.id} to={`/posts/${next.id}`}>
                                    {next.title} -
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}