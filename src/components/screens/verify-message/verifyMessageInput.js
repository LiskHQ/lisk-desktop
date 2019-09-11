import { cryptography } from '@liskhq/lisk-client';
import PropTypes from 'prop-types';
import React from 'react';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import Box from '../../toolbox/box';

export default class VerifyMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.inputs = [
      {
        name: 'message',
        placeholder: t('Write a message'),
        label: t('Message'),
      }, {
        name: 'publicKey',
        placeholder: t('Public key'),
        label: t('Public key'),
      }, {
        name: 'signature',
        placeholder: t('Signature'),
        label: t('Signature'),
      },
    ];

    this.state = this.inputs.reduce((inputs, { name }) => ({
      ...inputs,
      [name]: { value: '' },
    }), {});

    this.goNext = this.goNext.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: {
        value: target.value,
      },
    });
  }

  goNext() {
    let isCorrect = false;
    try {
      isCorrect = cryptography.verifyMessageWithPublicKey({
        message: this.state.message.value,
        signature: this.state.signature.value,
        publicKey: this.state.publicKey.value,
      });
    } catch (e) {
      isCorrect = false;
    }
    this.props.nextStep({ isCorrect });
  }

  render() {
    const { t, history } = this.props;

    return (
      <Box width="medium" main>
        <Box.Header>
          <h1>{t('Verify message')}</h1>
        </Box.Header>
        <Box.Content>
          <Box.InfoText>
            {t('Use this tool to verify the validity of a signed message. This allows you to ensure that the person who signed the message was in fact the account owner')}
          </Box.InfoText>
          {this.inputs.map(({ name, placeholder, label }) => (
            <Input
              key={name}
              name={name}
              className={name}
              placeholder={placeholder}
              label={label}
              value={this.state[name].value}
              onChange={this.handleChange}
            />
          ))}
        </Box.Content>
        <Box.Footer>
          <PrimaryButton onClick={this.goNext} className="continue">{t('Continue')}</PrimaryButton>
          <TertiaryButton onClick={history.goBack} className="go-back">{t('Go back')}</TertiaryButton>
        </Box.Footer>
      </Box>
    );
  }
}

VerifyMessageInput.propTypes = {
  history: PropTypes.object.isRequired,
  nextStep: PropTypes.func,
  t: PropTypes.func.isRequired,
};
