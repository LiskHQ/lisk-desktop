import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getBlock } from '@api/block';
import withData from '@utils/withData';
import { withTranslation } from 'react-i18next';
import WarnPunishedDelegate from './warnPunishedDelegate';

const mapStateToProps = (_, ownProps) => ({
  isBanned: ownProps.isBanned,
  readMore: ownProps.readMore,
  pomHeights: ownProps.pomHeights,
});

const apis = {
  timestamp: {
    apiUtil: (network, params) => getBlock({ network, params }),
    getApiParams: (_, ownProps) => ({
      height: ownProps.pomHeights[ownProps.pomHeights.length - 1]?.start,
    }),
    transformResponse: response => (response.data && response.data[0]),
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(WarnPunishedDelegate);
