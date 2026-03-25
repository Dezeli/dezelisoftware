import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const ProjectList = lazy(() => import('./pages/ProjectList'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const PostList = lazy(() => import('./pages/PostList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="flex h-[50vh] items-center justify-center text-zinc-400">
                    페이지를 불러오는 중입니다...
                </div>
            }>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="projects" element={<ProjectList />} />
                        <Route path="projects/:id" element={<ProjectDetail />} />
                        <Route path="posts" element={<PostList />} />
                        <Route path="posts/:id" element={<PostDetail />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App