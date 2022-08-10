/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
// eslint-disable-next-line import/prefer-default-export
export function getWalletAddressFromParams(addresses, params) {
  const paramsString = JSON.stringify(params);
  let address = '';

  addresses.forEach(addr => {
    if (paramsString.includes(addr)) {
      address = addr;
    }
  });

  return address;
}
