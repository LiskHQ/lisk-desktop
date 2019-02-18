import React from 'react';
import LiskHubExtensions from '../../utils/liskHubExtensions';


export default class ExtensionPoint extends React.Component {
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error(new Error(`Error in extension point '${this.props.identifier}' ${error}`));
  }

  render() {
    const modules = this.props.modules[this.props.identifier] || [];

    // TODO implement a way to highlight all extension points on a page
    // for easier discover by extension developers
    // e.g. localStorage.setItem('highlightExtensionPoints', true)
    // and this component will get a red border and title with its 'identifier'

    return <React.Fragment>
      { modules.map(({ moduleId }, i) => {
        const Component = LiskHubExtensions._modules[moduleId];
        if (Component) {
          return <Component
            data = {{
              latestBlocks: this.props.blocks && this.props.blocks.latestBlocks,
              time: this.props.test,
            }}
            onClickHandle={() => { this.props.testExtensions(); }}
            t={this.props.t}
            identifier={this.props.identifier}
            key={i} />;
        }
        // eslint-disable-next-line no-console
        console.error(new Error(`Invalid component in extension point ${this.props.identifier}`));
        return null;
      })}
    </React.Fragment>;
  }
}
