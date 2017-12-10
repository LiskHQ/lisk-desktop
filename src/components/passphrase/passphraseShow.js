import React from 'react';
import Input from '../toolbox/inputs/input';
import ActionBar from '../actionBar';
import styles from './passphrase.css';
import SliderCheckbox from '../toolbox/checkbox';

class PassphraseShow extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'introduction',
    };
  }

  next(e) {
    if (e.value === 'introduction' && e.checked) {
      this.setState({ step: 'revealing' });
    } else if (e.value === 'revealing' && e.checked) {
      this.setState({ step: 'revealed' });
    }
  }

  render() {
    const { t, passphrase, nextStep, prevStep } = this.props;

    return (
      <div className={`${styles.safekeeping} ${styles[this.state.step]}`}>
        <header>
          <h2 className={styles.introduction}>Your passphrase is used to access your Lisk ID.</h2>
          <h2 className={styles.revealing}>Carefully write it down.</h2>
          <h5 className={styles.revealing}>Make sure to keep it safe.</h5>
        </header>
        <section>
          <section className={styles.introduction}>
            <h6>I am responsible for keeping my passphrase safe.
            No one can restore it, not even Lisk.</h6>
            <SliderCheckbox
              label='I understand'
              icons={{
                done: 'done',
              }}
              onChange={this.next.bind(this)}
              input={{
                value: 'introduction',
              }}/>
          </section>
          <section className={styles.revealing}>
            <SliderCheckbox
              label='Drag to reveal'
              icons={{
                goal: 'lock',
                done: 'vpn_key',
              }}
              hasSlidingArrows={true}
              onChange={this.next.bind(this)}
              className={styles.bigSlider}
              input={{
                value: 'revealing',
              }}/>
            <Input type='text' multiline autoFocus={true}
              className={`${styles.input} passphrase`}
              value={passphrase} />
            <ActionBar
              secondaryButton={{
                label: t('Back'),
                onClick: () => prevStep({ jump: 2 }),
              }}
              primaryButton={{
                label: t('Yes! It\'s safe'),
                className: 'next-button',
                onClick: () => nextStep({ passphrase }),
              }} />
          </section>
        </section>
      </div>);
  }
}


export default PassphraseShow;
