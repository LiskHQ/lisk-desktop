import React from 'react';
import TopBar from './topBar';
import SideBar from './sideBar';

const NavigationBars = ({
  isSignInFlow,
  location,
  history,
}) => (
  <>
    <TopBar location={location} />
    <SideBar isSignInFlow={isSignInFlow} history={history} location={location} />
  </>
);

export default NavigationBars;
