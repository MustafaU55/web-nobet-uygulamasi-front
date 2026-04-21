import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher'ı window'a atıyoruz (tarayıcı tarafı için)
if (typeof window !== 'undefined') {
    window.Pusher = Pusher; // Pusher'ı window'a ekle
}

const createEcho = () => {
    if (typeof window === 'undefined') {
        return null; // SSR durumunda null döndür
    }

    return new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        wsHost: 'localhost',
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'http://localhost:6001/broadcasting/auth', // Laravel backend URL
        auth: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }
    });
};

export default createEcho; // Default export
