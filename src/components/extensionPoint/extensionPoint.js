import React from 'react';
import LiskHubExtensions from '../../utils/liskHubExtensions';


export default class ExtensionPoint extends React.Component {
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error(new Error(`Error in extension point '${this.props.identifier}' ${error}`));
  }

  render() {
    const modules = this.props.modules[this.props.identifier] || [];
    return <React.Fragment>
      { modules.map(({ moduleId }, i) => {
        const Component = LiskHubExtensions._modules[moduleId];
        if (Component) {
          return <Component
            t={this.props.t}
            identifier={this.props.identifier}
            key={i} />;
        } else {
          // eslint-disable-next-line no-console
          console.error(new Error(`Invalid component in extension point ${this.props.identifier}`));
        }
        return null;
      })}
    </React.Fragment>;
  }
}
