// lib/socket.js
export const connectWebSocket = () => {
  // SADECE Reverb'e bağlan (8080 portu)
  const socket = new WebSocket(
    `ws://localhost:8080/?appKey=${process.env.NEXT_PUBLIC_REVERB_APP_KEY}`
  );

  socket.onopen = () => {
    console.log('Reverb bağlantısı kuruldu');
    socket.send(JSON.stringify({
      event: 'subscribe',
      data: { channel: 'payments' }
    }));
  };

  return socket;
};