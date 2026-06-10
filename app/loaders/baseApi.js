import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async config => {
    try {
        let token;

        if (typeof window === 'undefined') {
            const { cookies } = (await import('next/headers'));
            token = cookies().get('token')?.value;
        } else {
            token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch {

    }

    return config;
});

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            const status = error.response.status ||
                (error.response.headers && error.response.headers.status) ||
                (error.response.headers && error.response.headers['status-code']);

            if (status && [407, 412, 417].includes(Number(status))) {
                if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    if (!['/', '/login', '/register', '/contact', '/#', '/pricing', '/#'].includes(currentPath)) {
                        window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;