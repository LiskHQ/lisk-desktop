import React from 'react';
import ActionBar from '../../actionBar';
import styles from './safekeeping.css';
// eslint-disable-next-line import/no-named-as-default
import SliderCheckbox from '../../toolbox/sliderCheckbox';
import TransitionWrapper from '../../toolbox/transitionWrapper';

class SafeKeeping extends React.Component {
  constructor() {
    super();
    this.state = {
      step: '',
    };
  }

  componentDidMount() {
    this.setState({
      step: this.props.step || 'introduction-step',
    });
  }

  next(e) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (e.value === 'introduction-step' && e.checked) {
        this.setState({ step: 'revealing-step' });
      } else if (e.value === 'revealing-step' && e.checked) {
        this.setState({ step: 'revealed-step' });
      }
    }, 500);
  }

  done() {
    this.setState({ step: 'done-step' });
    setTimeout(() => {
      this.props.nextStep({ passphrase: this.props.passphrase });
    }, 400);
  }

  render() {
    const {
      t, passphrase, prevStep, header, message,
    } = this.props;

    return (
      <section className={`${styles.safekeeping} ${styles[this.state.step]}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <h2 className={styles.introduction}>
                { header || '' }
              </h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='revealing-step,revealed-step'>
              <h2 className={styles.revealing}>Carefully write it down.</h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='revealing-step,revealed-step'>
              <h5 className={styles.revealing}>Make sure to keep it safe.</h5>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.introduction} ${styles.table}`}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <h5>{ message || ''}</h5>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='introduction-step' animationName='fade'>
              <SliderCheckbox
                className={`${styles.smallSlider} i-understand-checkbox`}
                label={t('I understand')}
                icons={{
                  done: 'checkmark',
                }}
                clickable={true}
                onChange={this.next.bind(this)}
                input={{
                  value: 'introduction-step',
                }}/>
            </TransitionWrapper>
          </div>
        </section>
        <section className={`${styles.revealing} ${styles.table}`}>
          <div className={styles.tableCell}>
            <p className={`${styles.input} ${styles.textarea} passphrase-wrapper`}>
              <textarea type='text' autoFocus={true} readOnly
                className={`${styles.hiddenInput} passphrase`}
                defaultValue={passphrase}></textarea>
              {
                passphrase.split(' ').map(word => <span className={styles.word} key={`wrapper-${word}`}>{ word } </span>)
              }
            </p>
            <TransitionWrapper current={this.state.step} step='revealing-step' animationName='fade'>
              <SliderCheckbox
                label={t('Drag to reveal')}
                icons={{
                  goal: 'locked',
                  done: 'checkmark',
                }}
                clickable={true}
                hasSlidingArrows={true}
                onChange={this.next.bind(this)}
                className={`${styles.bigSlider} reveal-checkbox`}
                input={{
                  value: 'revealing-step',
                }}/>
            </TransitionWrapper>
            <ActionBar
              className={styles.actionBar}
              secondaryButton={{
                label: t('Back'),
                className: `${styles.hidden} back-button`,
                onClick: () => prevStep({ jump: 2 }),
              }}
              primaryButton={{
                disabled: this.state.step === 'done-step',
                label: t('Yes! It\'s safe'),
                className: 'next-button yes-its-safe-button',
                onClick: this.done.bind(this),
              }} />
          </div>
        </section>
      </section>);
  }
}


export default SafeKeeping;
