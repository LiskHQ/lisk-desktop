import React from 'react';
import SignInHeader from './signInHeader';
import TopBar from './topBar';
import routes from '../../../constants/routes';

const Header = ({
  isSigninFlow,
  location: { pathname },
}) => pathname !== routes.termsOfUse.path && (
  isSigninFlow ? (
    <SignInHeader
      hideNetwork={pathname === routes.hwWallet.path}
      showSettings
    />
  ) : (
    <TopBar />
  )
);

export default Header;
