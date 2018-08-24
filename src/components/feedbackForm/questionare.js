import React from 'react';

import styles from './questionare.css';
import Input from '../toolbox/inputs/input';
import { Button, PrimaryButton } from '../toolbox/buttons/button';
import RadioSelector from './radioSelector';
import { getDeviceMetadata } from '../../utils/app';

const ratingValues = ['angry', 'sad', 'neutral', 'happy', 'laughing'];
const ratingIcons = ratingValues.map(ratingVal => [ratingVal]);
const metaValues = [true, false];
const metaIcons = metaValues.map(() => ['active', 'inactive']);

class Questionare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: false,
      expected: '',
      otherInput: '',
      metadata: false,
    };

    this.ratingProps = {
      values: ratingValues,
      onChange: this.setFeedbackValue.bind(this),
      icons: ratingIcons,
      iconPrefix: 'smiley-',
      name: 'rating',
      styles: {
        radioInput: styles.radioInput,
        radioGroup: styles.radioGroup,
      },
    };

    this.metadataProps = {
      values: metaValues,
      icons: metaIcons,
      onChange: this.setFeedbackValue.bind(this),
      iconPrefix: 'radio-button-',
      name: 'metadata',
      labels: [this.props.t('Okay'), this.props.t('No, thanks')],
      styles: {
        radioInput: styles.checkboxInput,
        radioGroup: styles.checkboxGroup,
      },
    };
  }

  setFeedbackValue(evt, key) {
    this.setState({ [key]: evt.target ? evt.target.value : evt });

    if (key === 'metadata' && !!evt.target.value) {
      this.setState({ metadata: getDeviceMetadata() });
    }
  }

  render() {
    return (<div>
      <div className={styles.main}>
        <label className={styles.label} htmlFor='rating'>
          {`${this.props.t('How do you like the hub?')}*`}
          <RadioSelector {...this.ratingProps} />
        </label>
        <Input
          multiline
          label={'Is there something different from what you expected?'}
          className={styles.textInput}
          value={this.state.expected}
          onChange={val => this.setFeedbackValue(val, 'expected')} >
        </Input>
        <Input
          multiline
          label={'Do you have other input for us?'}
          className={styles.textInput}
          value={this.state.otherInput}
          onChange={val => this.setFeedbackValue(val, 'otherInput')} >
        </Input>
        <label className={styles.label} htmlFor='metadata'>
          {`${this.props.t('Include your operating system and screen resolution in your report')}`}
          <RadioSelector {...this.metadataProps} />
        </label>
      </div>
      <div className={styles.actions}>
        <Button label={this.props.t('Cancel')}
          onClick={() => this.props.onCancel()}
          className='cancel-button' />
        <PrimaryButton label={this.props.t('Send')} disabled={!this.state.rating}
          onClick={() => this.props.onSubmit(this.state).bind(this)}
          className='send-button'/>
      </div>
    </div>);
  }
}

export default Questionare;
