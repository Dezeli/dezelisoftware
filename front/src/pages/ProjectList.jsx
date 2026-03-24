// front/src/pages/ProjectList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'

export default function ProjectList() {
    const [projects, setProjects] = useState([])
    const [skills, setSkills] = useState([])
    const [selectedSkill, setSelectedSkill] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axiosInstance.get('/skills')
                if (response.success) {
                    setSkills(response.data)
                }
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
                const url = selectedSkill ? `/projects?skill=${selectedSkill}` : '/projects'
                const response = await axiosInstance.get(url)
                
                if (response.success) {
                    setProjects(response.data.items) 
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError('프로젝트 목록을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [selectedSkill])

    if (error) return <div>에러: {error}</div>

    return (
        <div>
            <h2>프로젝트 포트폴리오</h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                    onClick={() => setSelectedSkill('')}
                    style={{ fontWeight: selectedSkill === '' ? 'bold' : 'normal' }}
                >
                    전체보기
                </button>
                {skills.map(skill => (
                    <button 
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill.name)}
                        style={{ fontWeight: selectedSkill === skill.name ? 'bold' : 'normal' }}
                    >
                        {skill.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>로딩 중...</div>
            ) : projects.length === 0 ? (
                <div>해당 기술 스택으로 진행된 프로젝트가 없습니다.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {projects.map(project => (
                        <div key={project.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>
                                <Link to={`/projects/${project.id}`}>{project.title}</Link>
                            </h3>
                            <p>{project.description}</p>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {project.tech_stacks.map(stack => (
                                    <span key={stack.id} style={{ fontSize: '0.8em', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                                        {stack.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}