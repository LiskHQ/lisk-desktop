/**
 * Tests useragent with a regexp and defines if the account is mobile device
 */
export default (agent, os) => {
  let reg = /iPad|iPhone|iPod/i;
  if (!os) {
    reg = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
  } else if (os === 'android') {
    reg = /android/i;
  }
  return (reg.test(agent || navigator.userAgent || navigator.vendor || window.opera));
};
