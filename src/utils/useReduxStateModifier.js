import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectApplications } from '@blockchainApplication/manage/store/selectors';
import networks from '@network/configuration/networks';
import { deleteNetworksInApplications } from '@blockchainApplication/manage/store/action';
import useSettings from '@settings/hooks/useSettings';

const useReduxStateModifier = () => {
  const dispatch = useDispatch();
  const { customNetworks } = useSettings('customNetworks');
  const { setValue: setMainChainNetwork, mainChainNetwork } = useSettings('mainChainNetwork');
  const applications = useSelector(selectApplications) || {};

  const removeDeadApplicationNetworkDomains = () => {
    const customNetworksHashmap = customNetworks.reduce((accum, customNetwork) => {
      accum[customNetwork.name] = customNetwork;
      return accum;
    }, {});

    const allNetworks = { ...networks, ...customNetworksHashmap };

    const applicationNetworkDomainsToRemove = Object.keys(applications).filter(
      (applicationName) => {
        const network = allNetworks[applicationName];
        return !network;
      }
    );
    if (applicationNetworkDomainsToRemove.length > 0) {
      dispatch(deleteNetworksInApplications(applicationNetworkDomainsToRemove));
    }
  };

  const removeCircularMainChainNetwork = () => {
    const { mainChainNetwork: circularObject, ...rest } = mainChainNetwork;

    if (circularObject) {
      setMainChainNetwork(rest);
    }
  };

  useEffect(() => {
    removeDeadApplicationNetworkDomains();
    removeCircularMainChainNetwork();
  }, []);
};

export { useReduxStateModifier };
