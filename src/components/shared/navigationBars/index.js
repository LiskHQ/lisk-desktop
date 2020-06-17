import React from 'react';
import SignInHeader from './signInHeader';
import TopBar from './topBar';
import SideBar from './sideBar';
import routes from '../../../constants/routes';

const NavigationBars = ({
  isSignInFlow,
  location,
  history,
}) => (
  <>
    {
      (location.pathname !== routes.termsOfUse.path && isSignInFlow)
        ? <SignInHeader hideNetwork={location.pathname === routes.hwWallet.path} showSettings />
        : <TopBar location={location} />
    }
    <SideBar isSignInFlow={isSignInFlow} history={history} location={location} />
  </>
);

export default NavigationBars;
