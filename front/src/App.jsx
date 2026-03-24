// front/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                    <Route path="posts" element={<PostList />} />
                    <Route path="posts/:id" element={<PostDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App