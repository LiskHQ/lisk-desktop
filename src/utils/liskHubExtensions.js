import store from '../store';
import { moduleAdded } from '../actions/extensions';
import Box from '../components/box';
import { Button } from '../components/toolbox/buttons/button';

const LiskHubExtensions = {
  identifiers: {
    // TODO move identifiers into constants folder and only import it here
    dashboardColumn1: 'dashboard-column-1',
    dashboardColumn2: 'dashboard-column-2',
    dashboardColumn3: 'dashboard-column-3',
    // TODO define and use further extension points
  },
  components: {
    Box, // TODO Adjust Box to be able to set it's height and other properties
    Button,
    // TODO add other components, such as input, other buttons etc.
  },
  addModule: ({ identifier, component }) => {
    const moduleId = window.crypto.getRandomValues(new Uint32Array(4)).toString('hex');

    // the component is stored in _modules because Redux can store only serializable objects
    LiskHubExtensions._modules[moduleId] = component;
    store.dispatch(moduleAdded({ identifier, moduleId }));
  },
  addPage: (/* { path, component } */) => {
    // TODO implement action, reducer and component for adding page
    throw new Error('Not implemented yet');
  },
  _modules: {
  },
};

export default LiskHubExtensions;
