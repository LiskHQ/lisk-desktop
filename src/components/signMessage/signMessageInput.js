import React from 'react';
import styles from './signMessageInput.css';
// eslint-disable-next-line import/no-named-as-default
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import { PrimaryButton } from '../toolbox/buttons/button';
import { parseSearchParams } from './../../utils/searchParams';
import TransitionWrapper from '../toolbox/transitionWrapper';

class SignMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { message } = this.getSearchParams();
    this.state = {
      step: 'introduction-step',
      message: {
        value: message || '',
      },
    };
  }

  handleChange(name, value) {
    this.setState({
      [name]: {
        value,
      },
    });
  }

  getSearchParams() {
    return parseSearchParams(this.props.history.location.search);
  }

  done() {
    this.props.nextStep({ message: this.state.message.value });
  }

  render() {
    const { t, header, message } = this.props;
    return (
      <section className={`${styles.signMessageInput}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <h2 className={`${styles.generatorHeader}`}
                id="generatorHeader" >
                {header}
              </h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='introduction-step'>
              <p className={styles.info}>
                {message}
              </p>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify} ${styles.content}`}>
          <TransitionWrapper current={this.state.step} step='introduction-step' animationName='fade'>
            <ToolBoxInput
              multiline
              label={this.props.t('Write a message')}
              className={`${styles.message} message`}
              onChange={this.handleChange.bind(this, 'message')}
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
