const subscribers = new Set();

export const notificationBus = {
  subscribe: (callback) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  emit: (notification) => {
    subscribers.forEach((cb) => {
      try {
        cb(notification);
      } catch (err) {
        // Prevent one subscriber from breaking others
        // eslint-disable-next-line no-console
        console.error('notificationBus subscriber error', err);
      }
    });
  },

  success: (title, message, options = {}) => {
    notificationBus.emit({ type: 'success', title, message, ...options });
  },

  error: (title, message, options = {}) => {
    notificationBus.emit({ type: 'error', title, message, ...options });
  },

  warning: (title, message, options = {}) => {
    notificationBus.emit({ type: 'warning', title, message, ...options });
  },

  info: (title, message, options = {}) => {
    notificationBus.emit({ type: 'info', title, message, ...options });
  }
};
