// front/src/pages/PostDetail.jsx
import { useParams } from 'react-router-dom'

export default function PostDetail() {
    const { id } = useParams()
    return <h2>블로그 글 상세: {id}</h2>
}