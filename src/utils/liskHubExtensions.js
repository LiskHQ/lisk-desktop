import store from '../store';
import { moduleAdded } from '../actions/extensions';
import Box from '../components/box';
import { Button } from '../components/toolbox/buttons/button';

const LiskHubExtensions = {
  identifiers: {
    dashboardColumn1: 'dashboard-column-1',
    dashboardColumn2: 'dashboard-column-2',
    dashboardColumn3: 'dashboard-column-3',
  },
  Components: { Box, Button },
  addModule: ({ identifier, component }) => {
    const moduleId = window.crypto.getRandomValues(new Uint32Array(4)).toString('hex');

    // the component is stored in _modules because Redux can store only serializable objects
    LiskHubExtensions._modules[moduleId] = component;
    store.dispatch(moduleAdded({ identifier, moduleId }));
  },
  addPage: (/* { path, component } */) => {
    throw new Error('Not implemented yet');
  },
  _modules: {
  },
};

export default LiskHubExtensions;
