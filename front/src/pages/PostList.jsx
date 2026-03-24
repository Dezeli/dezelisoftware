// front/src/pages/PostList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'

export default function PostList() {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories')
                if (response.success) {
                    setCategories(response.data)
                }
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
                if (selectedCategory) {
                    url += `&category=${selectedCategory}`
                }
                
                const response = await axiosInstance.get(url)
                if (response.success) {
                    setPosts(response.data.items)
                    setTotalPages(Math.ceil(response.data.count / 9))
                } else {
                    setError(response.message)
                }
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

    if (error) return <div>에러: {error}</div>

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>기술 블로그</h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => handleCategoryClick('')}
                    style={{ fontWeight: selectedCategory === '' ? 'bold' : 'normal' }}
                >
                    전체보기
                </button>
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        style={{ fontWeight: selectedCategory === category.name ? 'bold' : 'normal' }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>로딩 중...</div>
            ) : posts.length === 0 ? (
                <div>작성된 블로그 글이 없습니다.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>
                                <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                                    {post.title}
                                </Link>
                            </h3>
                            <div style={{ fontSize: '0.85em', color: '#666', display: 'flex', gap: '10px' }}>
                                <span style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                                    {post.category.name}
                                </span>
                                <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        이전
                    </button>
                    <span style={{ padding: '5px' }}>{page} / {totalPages}</span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    )
}