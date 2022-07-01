/* eslint-disable max-statements */
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import { getTransactions } from '@transaction/api';
import Overview from './overview';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length
    ? state.blocks.latestBlocks[0].height
    : 0,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params }),
      defaultData: { data: [], meta: {} },
      autoload: false,
    },
  }),
  withTranslation(),
)(Overview);
