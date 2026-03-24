// front/src/api/axios.js
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response && error.response.data) {
            console.error('API 에러:', error.response.data.message)
            return Promise.reject(error.response.data)
        }
        console.error('네트워크 에러:', error.message)
        return Promise.reject(error)
    }
)

export default axiosInstance