import React from 'react';
import TopBar from './topBar';
import SideBar from './sideBar';

const NavigationBars = ({ isSignInFlow, location, history }) => (
  <>
    <TopBar location={location} history={history} />
    <SideBar isSignInFlow={isSignInFlow} location={location} />
  </>
);

export default NavigationBars;
