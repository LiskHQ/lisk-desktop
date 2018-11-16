import { connect } from 'react-redux';
import PricedButton from './pricedButton';

const mapStateToProps = state => ({
  balance: state.account.balance,
});

export default connect(mapStateToProps)(PricedButton);
