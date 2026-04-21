// lib/socketClient.js
export class SocketClient {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(`ws://${window.location.hostname}:6001/app/your-app-key`);

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event && this.callbacks[data.event]) {
          this.callbacks[data.event].forEach(cb => cb(data.data));
        }
      };
    }
  }

  subscribe(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);

    // İlk bağlantıyı yap
    if (!this.socket) {
      this.connect();
    }
  }
}

export const socketClient = new SocketClient();