import React from 'react';
import TopBar from './topBar';
import SideBar from './sideBar';

const NavigationBars = ({ location, history }) => (
  <>
    <TopBar location={location} history={history} />
    <SideBar location={location} />
  </>
);

export default NavigationBars;
