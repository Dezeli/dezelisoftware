// front/src/pages/Home.jsx
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'

export default function Home() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/profile')
                
                if (response.success) {
                    setProfile(response.data)
                } else {
                    setError(response.message)
                }
            } catch (err) {
                setError('프로필 데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error}</div>
    if (!profile) return <div>데이터가 없습니다.</div>

    return (
        <div style={{ padding: '20px' }}>
            <h2>{profile.name}의 포트폴리오</h2>
            <h3 style={{ color: '#666' }}>{profile.slogan}</h3>
            
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <p>{profile.introduction}</p>
                <p><strong>연락처:</strong> {profile.contact_email}</p>
            </div>

            <h4>기술 스택</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {profile.skills.map(skill => (
                    <span 
                        key={skill.id} 
                        style={{ padding: '5px 10px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}
                    >
                        {skill.name}
                    </span>
                ))}
            </div>
        </div>
    )
}