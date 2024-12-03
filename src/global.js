// global.js
const globalState = {
  userInfo: null, // 用于存储用户信息
};

export default globalState;
export function setUserInfo(userInfo) {
  globalState.userInfo = userInfo;
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}
export function getUserInfo() {
  if (!globalState.userInfo) {
    globalState.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  }
  return globalState.userInfo;
}
