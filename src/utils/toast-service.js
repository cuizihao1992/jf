import './toast-message.js';

export function showToast({ message, type = 'info', duration = 3000 }) {
  const toast = document.createElement('toast-message');
  toast.message = message;
  toast.type = type;
  toast.duration = duration;

  // 将消息提示添加到 body
  document.body.appendChild(toast);
}
window.showToast = showToast;
