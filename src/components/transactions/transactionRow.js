import React from 'react';
import moment from 'moment';
import { translate } from 'react-i18next';
import TransactionType from './transactionType';
import styles from './transactions.css';
import Amount from './amount';
import Spinner from '../spinner';
import { _convertTimeFromFirstBlock } from './../timestamp/index';

class TransactionRow extends React.Component {
  constructor() {
    super();
    this.state = {
      toggle: false,
    };
  }
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate(nextProps) {
    return nextProps.value.confirmations <= 1000;
  }

  toggleElement() {
    this.setState({ toggle: !this.state.toggle });
  }

  render() {
    const props = this.props;
    const day = moment(_convertTimeFromFirstBlock(props.value.timestamp));

    return (<tr>
      <td className={`${props.tableStyle.rowCell} ${styles.leftText} ${styles.address}`}>
        <TransactionType {...props.value} address={props.address}></TransactionType>

        {this.state.toggle ? <div>Transaction ID: <a href="#">{props.value.id}</a></div> : ''}
      </td>
      <td className={`${props.tableStyle.rowCell} ${styles.rightText}`}>
        {props.value.confirmations ? day.format('ll') :
          <Spinner />}
        {this.state.toggle ? <div>{day.format('LTS')}</div> : ''}
      </td>
      <td className={`${props.tableStyle.rowCell} ${styles.rightText}`}>
        <Amount {...props}></Amount>
      </td>
      <td className={`${props.tableStyle.rowCell}`}>
        <img src="./../../assets/images/darkblue_angle_down.svg" onClick={this.toggleElement.bind(this)}/>
      </td>
    </tr>
    );
  }
}

export default translate()(TransactionRow);
