import styles from '../components/savedAccounts/savedAccounts.css';
// eslint-disable-next-line import/prefer-default-export
export function applyDeviceClass(html, navigator) {
  const classNames = [];
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
    classNames.push(styles.deviceIos);
  }
  if (navigator.userAgent.match(/android/i)) {
    classNames.push(styles.deviceAndroid);
  }

  if (classNames.length) {
    classNames.push('on-device');
  }
  if (html.classList) {
    html.classList.add(...classNames);
  }
}
