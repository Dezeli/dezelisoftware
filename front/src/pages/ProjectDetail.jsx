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

    useEffect(() => {
        const fetchProjectDetail = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.get(`/projects/${id}`)
                if (response.success) {
                    setProject(response.data)
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError('프로젝트 상세 정보를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchProjectDetail()
    }, [id])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error}</div>
    if (!project) return <div>데이터가 없습니다.</div>

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/projects')} style={{ marginBottom: '20px' }}>
                목록으로 돌아가기
            </button>

            <h2>{project.title}</h2>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
                {project.tech_stacks.map(stack => (
                    <span key={stack.id} style={{ backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
                        {stack.name}
                    </span>
                ))}
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', minHeight: '150px' }}>
                <p style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
            </div>

            {project.github_url && (
                <div style={{ marginBottom: '40px' }}>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        GitHub 저장소 보기
                    </a>
                </div>
            )}

            <hr style={{ margin: '40px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.previous_projects && project.previous_projects.length > 0 && (
                        <>
                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#666' }}>이전 프로젝트</p>
                            {project.previous_projects.map(prev => (
                                <Link key={prev.id} to={`/projects/${prev.id}`}>
                                    - {prev.title}
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
                    {project.next_projects && project.next_projects.length > 0 && (
                        <>
                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#666' }}>다음 프로젝트</p>
                            {project.next_projects.map(next => (
                                <Link key={next.id} to={`/projects/${next.id}`}>
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