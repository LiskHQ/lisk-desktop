// eslint-disable-next-line import/prefer-default-export
export function applyDeviceClass(html) {
  const classNames = [];

  if (classNames.length) {
    classNames.push('on-device');
  }
  if (html.classList) {
    html.classList.add(...classNames);
  }
}
