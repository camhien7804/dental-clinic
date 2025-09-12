// Lưu context tạm thời trong RAM
const sessions = new Map();

/**
 * Lưu context cho user
 */
export function setContext(userId, context) {
  sessions.set(userId, context);
}

/**
 * Lấy context gần nhất của user
 */
export function getContext(userId) {
  return sessions.get(userId) || null;
}
