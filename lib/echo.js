let echo = null;

if (typeof window !== 'undefined') {
    const Pusher = require('pusher-js'); // Dinamik import sayesinde SSR'de çalışmaz
    const Echo = require('laravel-echo'); // Aynı şekilde SSR'den korunmuş olur

    window.Pusher = Pusher;

    echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        forceTLS: true,
        wsPort: 6001,
    });
}

export default echo;
