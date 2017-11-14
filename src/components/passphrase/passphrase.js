import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from './../toolbox/input';
import styles from './passphrase.css';
import InfoParagraph from '../infoParagraph';
import PassphraseGenerator from './passphraseGenerator';
import PassphraseVerifier from './passphraseVerifier';
import ActionBar from '../actionBar';
import stepsConfig from './steps';

class Passphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      current: 'info',
      answer: '',
    };
  }

  changeHandler(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const templates = {};
    const { current } = this.state;
    const steps = stepsConfig(this);

    // Step 1: Information/introduction
    templates.info = <InfoParagraph className={styles.noHr}>
      {this.props.t('Please click Next, then move around your mouse randomly to generate a random passphrase.')}
      <br />
      <br />
      {this.props.t('Note: After registration completes,')} { this.props.useCaseNote }
      <br />
      { this.props.securityNote } {this.props.t('Please keep it safe!')}
    </InfoParagraph>;

    // step 2: Generator, binds mouse events
    templates.generate = <PassphraseGenerator t={this.props.t}
      changeHandler={this.changeHandler.bind(this)} />;

    // step 3: Confirmation, shows the generated passphrase for user to save it
    templates.show = <Input type='text' multiline autoFocus={true}
      className='passphrase'
      label={this.props.t('Save your passphrase in a safe place')}
      value={this.state.passphrase} />;

    // step 4: Verification, Asks for a random word to make sure the user has copied the passphrase
    templates.confirm = <PassphraseVerifier
      t={this.props.t}
      passphrase={this.state.passphrase}
      answer={this.state.answer}
      updateAnswer={this.changeHandler.bind(this, 'answer')} />;

    return (
      <div>
        <section className={`${styles.templateItem} ${grid.row} ${grid['middle-xs']}`}>
          <div className={grid['col-xs-12']}>
            { templates[current] }
          </div>
        </section>

        <ActionBar
          secondaryButton={{
            label: steps[current].cancelButton.title(),
            onClick: steps[current].cancelButton.onClick.bind(this),
          }}
          primaryButton={{
            label: steps[current].confirmButton.title(),
            fee: steps[current].confirmButton.fee(),
            className: 'next-button',
            disabled: (current === 'generate' && !this.state.passphrase) ||
              (current === 'confirm' && !this.state.answer),
            onClick: steps[current].confirmButton.onClick.bind(this),
          }} />
      </div>
    );
  }
}

export default Passphrase;
