// front/src/pages/ProjectDetail.jsx
import { useParams } from 'react-router-dom'

export default function ProjectDetail() {
    const { id } = useParams()
    return <h2>프로젝트 상세: {id}</h2>
}