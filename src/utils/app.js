export const getDeviceMetadata = /* istanbul ignore next */() => {
  /* istanbul ignore next */
  const {
    platform,
    appCodeName,
    appName,
    appVersion,
    language,
    oscpu,
    vendor,
    vendorSub,
    product,
    userAgent,
    cookieEnabled,
  } = window.navigator;
  return {
    platform,
    appCodeName,
    appName,
    appVersion,
    language,
    oscpu,
    vendor,
    vendorSub,
    product,
    userAgent,
    cookieEnabled,
  };
};

export default getDeviceMetadata;
