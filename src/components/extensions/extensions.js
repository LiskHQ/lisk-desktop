import React from 'react';

import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import Box from '../box';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import localJSONStorage from './../../utils/localJSONStorage';
import { loadRemoteComponent } from './../../utils/extensions';

import styles from './extensions.css';

class Extensions extends React.Component {
  constructor() {
    super();

    this.state = {
      url: '',
    };
  }

  handleInput(value, key) {
    this.setState({ [key]: value });
  }

  removeExtension() {
    let urls = localJSONStorage.get('url', []);
    urls = urls.filter(url => url !== this.state.url);
    localJSONStorage.set('url', urls);
  }

  addExtension() {
    let urls = localJSONStorage.get('url', []);
    urls.push(this.state.url);
    localJSONStorage.set('url', urls);
    loadRemoteComponent(this.state.url);
  }

  render() {
    return (
      <Box>
        <div className={styles.container}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('Add Extension')}</h2>
          </header>
          <div className={styles.extentionsWrapper}>
            <ToolBoxInput
              label={this.props.t('Enter URL of the *.js file with the extension')}
              value={this.state.url}
              onChange={val => this.handleInput(val, 'url')} >
            </ToolBoxInput>
          </div>
          <div className={styles.footer}>
            <SecondaryButtonV2
              disabled={this.state.url.length === 0}
              label={this.props.t('Remove Extension')}
              onClick={() => this.removeExtension()} />

            <PrimaryButtonV2
              disabled={this.state.url.length === 0}
              label={this.props.t('Add Extension')}
              onClick={() => this.addExtension()} />
          </div>
        </div>
      </Box>
    );
  }
}

export default Extensions;
