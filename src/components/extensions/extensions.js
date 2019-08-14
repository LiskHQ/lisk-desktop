import React from 'react';

import { Input } from '../toolbox/inputs';
import Box from '../toolbox/box';
import { PrimaryButton, SecondaryButton } from '../toolbox/buttons/button';
import Feedback from '../toolbox/feedback/feedback';
import localJSONStorage from '../../utils/localJSONStorage';
import loadRemoteComponent from '../../utils/extensions';
import routes from '../../constants/routes';
import feedbackLinks from '../../constants/feedbackLinks';

import styles from './extensions.css';

class Extensions extends React.Component {
  constructor() {
    super();

    this.state = {
      url: localJSONStorage.get('url', ''),
      error: '',
    };

    this.handleInput = this.handleInput.bind(this);
    this.addExtension = this.addExtension.bind(this);
    this.removeExtension = this.removeExtension.bind(this);
  }

  handleInput({ target: { value } }) {
    // const regex = /^(https:\/\/raw.githubusercontent.
    // com\/michaeltomasik\/extensions-lisk\/master\/)/g;
    const error = '';
    // if (!value.match(regex)) {
    //   error = this.props.t('Use extensions from https://raw.githubusercontent.com/michaeltomasik/extensions-lisk/master/');
    // }

    this.setState({ url: value, error });
  }

  removeExtension() {
    // TODO Multiple extensions
    // let urls = localJSONStorage.get('url', '');
    // urls = urls.filter(url => url !== this.state.url);
    this.setState({ url: '' });
    localJSONStorage.set('url', '');
  }

  addExtension() {
    // TODO Multiple extensions
    // const urls = localJSONStorage.get('url', '');
    // urls.push(this.state.url);
    localJSONStorage.set('url', this.state.url);
    loadRemoteComponent(this.state.url);
    this.props.history.push(`${routes.dashboard.path}`);
  }

  render() {
    return (
      <div className={styles.container}>
        <Box width="medium">
          <Box.Header className={styles.headerWrapper}>
            <h2>{this.props.t('Add Extension')}</h2>
          </Box.Header>
          <Box.Content className={styles.content}>
            <div className={styles.feedbackWrapper}>
              <div
                className={styles.label}
              >
                {this.props.t('Beta: in order to see changes fully please reload the app when removing extension')}
              </div>
              <a
                className={styles.link}
                target="_blank"
                href={feedbackLinks.extensions}
                rel="noopener noreferrer"
              >
                {this.props.t('Give feedback about this feature')}
              </a>
            </div>
            <label className={styles.extentionsWrapper}>
              <span>{this.props.t('Enter URL of the *.js file with the extension')}</span>
              <Input
                error={this.state.error}
                value={this.state.url}
                onChange={this.handleInput}
                disabled={PRODUCTION}
              />
            </label>
            {PRODUCTION ? (
              <Feedback
                show
                status="error"
                className={styles.error}
              >
                {this.props.t('Adding extensions is currently disabled in production version of Lisk Hub')}
              </Feedback>
            ) : (
              <div className={styles.footer}>
                <SecondaryButton
                  disabled={PRODUCTION || this.state.url.length === 0}
                  label={this.props.t('Remove Extension')}
                  onClick={this.removeExtension}
                />

                <PrimaryButton
                  disabled={PRODUCTION || (this.state.error !== ''
                    || this.state.url === localJSONStorage.get('url', ''))}
                  label={this.props.t('Add Extension')}
                  onClick={this.addExtension}
                />
              </div>
            )}
          </Box.Content>
        </Box>
      </div>
    );
  }
}

export default Extensions;
