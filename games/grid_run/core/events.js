// EventBus.js
// A simple Publish/Subscribe system to decouple game logic from UI.

class EventBus {
    constructor() {
        this.listeners = {};
    }

    // Subscribe to an event
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // Unsubscribe
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    // Publish an event
    emit(event, data = {}) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
        
        // Debug logging (optional, can be toggleable)
        // console.log(`[EVENT] ${event}`, data);
    }
}

// Export a singleton instance
export const bus = new EventBus();
