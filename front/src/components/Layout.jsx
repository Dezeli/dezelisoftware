// front/src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
    return (
        <div>
            <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
                <Link to="/projects" style={{ marginRight: '15px' }}>Projects</Link>
                <Link to="/posts">Blog</Link>
            </nav>
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    )
}