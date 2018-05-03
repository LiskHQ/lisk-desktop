import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, PrimaryButton } from './../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import Converter from '../converter';
import Input from '../toolbox/inputs/input';
import fees from './../../constants/fees';
import regex from './../../utils/regex';
import styles from './request.css';
import inputTheme from './input.css';

class SpecifyRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: { value: this.props.address },
      amount: { value: '' },
    };
    this.fee = fees.send;
    this.inputValidationRegexps = {
      recipient: regex.address,
      amount: regex.amount,
    };
  }

  validateInput(name, value) {
    if (!value || value === '0') {
      return this.props.t('Required');
    } else if (!value.match(this.inputValidationRegexps[name])) {
      return this.props.t('Invalid amount');
    }
    return undefined;
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : this.validateInput(name, value),
      },
    });
  }

  render() {
    return (
      <div className={`${styles.wrapper}`}>
        <div className={styles.header}>
          <header>
            <h2>{this.props.t('Specify Amount')}</h2>
          </header>
        </div>
        <div>
          <Input label={this.props.t('Receiver')}
            className={`recipient ${styles.disabledInput}`}
            value={this.state.recipient.value}
            theme={inputTheme}
            disabled={true}>
            <figure className={styles.accountVisual}>
              <AccountVisual address={this.state.recipient.value} size={50} />
            </figure>
          </Input>

          <Converter
            label={this.props.t('Request amount (LSK)')}
            className='amount'
            theme={styles}
            error={this.state.amount.error}
            value={this.state.amount.value}
            onChange={this.handleChange.bind(this, 'amount')}
            t={this.props.t}
          />
        </div>
        <footer>
          <section className={grid.row} >
            <div className={grid['col-xs-4']}>
              <Button
                className={styles.backButton}
                label={this.props.t('Back')}
                onClick={() => this.props.prevStep({
                  reset: this.props.skipped,
                  recipient: this.props.recipient,
                  amount: this.props.amount,
                }) }
              />
            </div>
            <div className={grid['col-xs-8']}>
              <PrimaryButton
                label={this.props.t('Next')}
                className='confirm-request'
                onClick={() => this.props.nextStep({
                  address: this.state.recipient.value,
                  amount: this.state.amount.value,
                })}
                disabled={(!!this.state.recipient.error ||
                  !this.state.recipient.value ||
                  !!this.state.amount.error ||
                  !this.state.amount.value)}
              />
              <div className='subTitle'></div>
            </div>
          </section>
        </footer>
      </div>
    );
  }
}

export default SpecifyRequest;
