export function showError(message) {
  console.error(message);
  // 如果存在全局 showToast 函数则使用
  if (typeof showToast === 'function') {
    showToast({ message, type: 'error', duration: 3000 });
  }
} 