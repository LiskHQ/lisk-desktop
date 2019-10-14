/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withResizeValues from '../../../../utils/withResizeValues';

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.match.params.id,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: liskService.getBlockDetails,
      autoload: true,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: liskService.getBlockTransactions,
      defaultData: [],
      autoload: true,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: (response, oldData) => [
        ...oldData,
        ...response.data.filter(transaction => !oldData.find(({ id }) => id === transaction.id)),
      ],
    },
  }),
  withTranslation(),
  withResizeValues,
)(BlockDetails);
