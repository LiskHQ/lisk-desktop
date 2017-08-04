import React from 'react';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './passphrase.css';
import InfoParagraph from '../infoParagraph';
import PassphraseGenerator from './passphraseGenerator';
import PassphraseVerifier from './passphraseVerifier';
import steps from './steps';

class Passphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      steps: steps(this),
      currentStep: 'info',
      answer: '',
    };
  }

  changeHandler(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const templates = {};

    const useCaseNote = 'your passphrase will be required for logging in to your account.';
    const securityNote = 'This passphrase is not recoverable and if you lose it, you will lose access to your account forever.';

    // Step 1: Information/introduction
    templates.info = <InfoParagraph className={styles.noHr}>
        Please click Next, then move around your mouse randomly to generate a random passphrase.
        <br />
        <br />
        Note: After registration completes, { this.props.useCaseNote || useCaseNote }
        <br />
        { this.props.securityNote || securityNote } Please keep it safe!
      </InfoParagraph>;

    // step 2: Generator, binds mouse events
    templates.generate = <PassphraseGenerator
      changeHandler={this.changeHandler.bind(this)} />;

    // step 3: Confirmation, Asks for a random word to make sure the user has copied the passphrase
    templates.show = <Input type='text' multiline label='Passphrase'
      value={this.state.passphrase} />;

    // step 4: Verification, Asks for a random word to make sure the user has copied the passphrase
    templates.confirm = <PassphraseVerifier
      passphrase={this.state.passphrase}
      answer={this.state.answer}
      updateAnswer={this.changeHandler.bind(this, 'answer')} />;

    return (
      <div>
        <section className={`${styles.templateItem} ${grid['middle-xs']}`}>
          <div className={grid['col-xs-12']}>
            <div className='box'>
              { templates[this.state.currentStep] }
            </div>
          </div>
        </section>
        <section className={`${grid.row} ${grid['between-xs']}`}>
          <Button label={this.state.steps[this.state.currentStep].cancelButton.title}
            className={`${styles.cancel} cancel-button`}
            onClick={this.state.steps[this.state.currentStep].cancelButton.onClick.bind(this)} />

          <Button label={this.state.steps[this.state.currentStep].confirmButton.title()}
            primary={true} raised={true}
            className={`${styles.approve} next-button`}
            disabled={(this.state.currentStep === 'generate' && !this.state.passphrase) ||
              (this.state.currentStep === 'confirm' && !this.state.answer)}
            onClick={this.state.steps[this.state.currentStep].confirmButton.onClick.bind(this)}/>
        </section>
      </div>
    );
  }
}

export default Passphrase;
