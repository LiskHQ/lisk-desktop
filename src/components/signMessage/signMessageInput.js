import React from 'react';
import { parseSearchParams } from './../../utils/searchParams';
import Piwik from '../../utils/piwik';
import { AutoresizeTextarea } from '../toolbox/inputsV2';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';

class SignMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { message } = parseSearchParams(props.history.location.search);
    this.state = {
      message: {
        value: message || '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: {
        value,
      },
    });
  }

  nextStep() {
    Piwik.trackingEvent('SignMessageInput', 'button', 'Next step');
    this.props.nextStep({ message: this.state.message.value });
  }

  render() {
    const { t, history } = this.props;
    const { message } = this.state;
    return (
      <section>
        <div>
          <span>{t('Step 1/2')}</span>
          <h1>{t('Sign a message')}</h1>
          <p>{t('You can use your passphrase to sign a message. This signed message can prove that you are the owner of the account, since only your passphrase can produce it. We reccomend including date & time or a specific keyword.')}</p>
        </div>
        <div>
          <label>
            <span>{t('Message')}</span>
            <AutoresizeTextarea
              name={'message'}
              onChange={this.handleChange}
              value={message.value} />
          </label>
        </div>
        <div>
          <PrimaryButtonV2
            onClick={this.nextStep}
          >{
            t('Continue')
          }</PrimaryButtonV2>
          <TertiaryButtonV2
            onClick={history.goBack}
          >{
            t('Go Back')
          }</TertiaryButtonV2>
        </div>
      </section>
    );
  }
}


export default SignMessageInput;
