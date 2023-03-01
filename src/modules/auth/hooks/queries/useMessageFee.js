// @Todo: should be re-instated and refactored when the command to get ccm fee has been implemented
export const useMessageFee = (/* { options = {}, isEnabled } = {} */) => {
  // const result = useInvokeQuery({
  //   config,
  //   options: { ...options, enabled: isEnabled },
  // });
  const messageFee = 50000000;

  return { data: messageFee };
};
