// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { withTranslation } from 'react-i18next';
import { balanceReclaimed } from '@legacy/store/action';
import Summary from './Summary';

const mapStateToProps = (state) => ({
  wallet: selectActiveTokenAccount(state),
});

const dispatchToProps = {
  balanceReclaimed,
};

export default compose(connect(mapStateToProps, dispatchToProps), withTranslation())(Summary);
