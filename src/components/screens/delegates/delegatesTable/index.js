/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { voteToggled, delegatesAdded } from '../../../../actions/voting';
import DelegatesTable from './delegatesTable';
import withDelegatesData from './withDelegatesData';

const mapStateToProps = state => ({
  votes: state.voting.votes,
  delegates: state.voting.delegates,
});

const mapDispatchToProps = {
  voteToggled,
  delegatesCleared: () => delegatesAdded({
    list: [],
  }),
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
  withDelegatesData(),
)(DelegatesTable);
