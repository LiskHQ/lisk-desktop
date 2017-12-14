import React from 'react';
import Input from '../../toolbox/inputs/input';
import ActionBar from '../../actionBar';
import styles from './safekeeping.css';
import SliderCheckbox from '../../toolbox/checkbox';

class PassphraseShow extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'introduction-step',
    };
  }

  next(e) {
    if (e.value === 'introduction-step' && e.checked) {
      this.setState({ step: 'revealing-step' });
    } else if (e.value === 'revealing-step' && e.checked) {
      this.setState({ step: 'revealed-step' });
    }
  }

  render() {
    const { t, passphrase, nextStep, prevStep } = this.props;

    return (
      <section className={`${styles.safekeeping} ${styles[this.state.step]}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <h2 className={styles.introduction}>Your passphrase is used to access your Lisk ID.</h2>
            <h2 className={styles.revealing}>Carefully write it down.</h2>
            <h5 className={styles.revealing}>Make sure to keep it safe.</h5>
          </div>
        </header>
        <section className={`${styles.introduction} ${styles.table}`}>
          <div className={styles.tableCell}>
            <h5>{t('I am responsible for keeping my passphrase safe. No one can restore it, not even Lisk.')}</h5>
            <SliderCheckbox
              className={`${styles.smallSlider} i-understand-checkbox`}
              label={t('I understand')}
              icons={{
                done: 'done',
              }}
              onChange={this.next.bind(this)}
              input={{
                value: 'introduction-step',
              }}/>
          </div>
        </section>
        <section className={`${styles.revealing} ${styles.table}`}>
          <div className={styles.tableCell}>
            <SliderCheckbox
              label={t('Drag to reveal')}
              icons={{
                goal: 'lock',
                done: 'vpn_key',
              }}
              hasSlidingArrows={true}
              onChange={this.next.bind(this)}
              className={`${styles.bigSlider} reveal-checkbox`}
              input={{
                value: 'revealing-step',
              }}/>
            <Input type='text' multiline autoFocus={true}
              className={`${styles.input} passphrase`}
              value={passphrase} />
            <ActionBar
              className={styles.actionBar}
              secondaryButton={{
                label: t('Back'),
                className: styles.hidden,
                onClick: () => prevStep({ jump: 2 }),
              }}
              primaryButton={{
                label: t('Yes! It\'s safe'),
                className: 'next-button',
                onClick: () => nextStep({ passphrase }),
              }} />
          </div>
        </section>
      </section>);
  }
}


export default PassphraseShow;
