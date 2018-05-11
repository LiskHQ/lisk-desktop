import React from 'react';
import styles from './signMessageInput.css';
// eslint-disable-next-line import/no-named-as-default
import Input from '../toolbox/inputs/input';
import { PrimaryButton } from '../toolbox/buttons/button';
import TransitionWrapper from '../toolbox/transitionWrapper';

class SignMessageInput extends React.Component {
  constructor() {
    super();
    this.state = {
      step: '',
      message: {},
    };
  }

  componentDidMount() {
    this.setState({
      step: this.props.step || 'introduction-step',
    });
  }

  handleChange(name, value) {
    this.setState({
      [name]: {
        value,
        error: value === '' ? this.props.t('Required') : '',
      },
    });
  }

  done() {
    this.props.nextStep({ message: this.state.message.value });
  }

  render() {
    const { t, header, message } = this.props;
    return (
      <section className={`${styles.safekeeping} ${styles[this.state.step]}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <h2 className={styles.introduction}>
                { header || '' }
              </h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <h5>{ message || ''}</h5>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify} ${styles.content}`}>
          <TransitionWrapper current={this.state.step} step='introduction-step' animationName='fade'>
            <Input
              multiline
              label={this.props.t('message')}
              className={`${styles.message} message`}
              onChange={this.handleChange.bind(this, 'message')}
              error={this.state.message.error}
              value={this.state.message.value}/>
          </TransitionWrapper>
          <TransitionWrapper current={this.state.step} step='introduction-step' animationName='fade'>
            <PrimaryButton
              className={`${styles.nextButton} next`}
              label={t('Next')}
              onClick={this.done.bind(this)}
              type={'button'}
              disabled={!this.state.message.value} />
          </TransitionWrapper>
        </section>
      </section>);
  }
}


export default SignMessageInput;
