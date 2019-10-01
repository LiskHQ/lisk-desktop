/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.match.params.id,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: liskService.getBlockDetails,
      defaultData: [],
      autoload: true,
      getApiParams: (state, ownProps) => ({
        id: ownProps.id,
      }),
    },
  }),
  withTranslation(),
)(BlockDetails);
