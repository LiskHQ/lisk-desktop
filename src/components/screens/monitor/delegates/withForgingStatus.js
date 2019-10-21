import { connect } from 'react-redux';
import React from 'react';
import { olderBlocksRetrieved } from '../../../../actions/blocks';
import liskService from '../../../../utils/api/lsk/liskService';
import voting from '../../../../constants/voting';

const withForgingStatus = delegatesKey => (ChildComponent) => {
  class DelegatesContainer extends React.Component {
    componentDidMount() {
      const { network: networkConfig, latestBlocks } = this.props;
      const limit = 100;
      // TODO figure out how to mock latestBlocks in connect
      // istanbul ignore else
      if (latestBlocks.length < limit) {
        liskService.getLastBlocks({ networkConfig }, { limit }).then((blocks) => {
          this.props.olderBlocksRetrieved({ blocks });
        });
      }
    }

    // TODO figure out how to mock latestBlocks in connect
    // istanbul ignore next
    getForgingStatus(delegate) {
      const { latestBlocks } = this.props;
      const height = latestBlocks[0] && latestBlocks[0].height;
      const roundStartHeight = height - (height % voting.numberOfActiveDelegates);
      const block = latestBlocks.find(b => b.generatorPublicKey === delegate.publicKey);
      if (block) {
        if (block.height > roundStartHeight) {
          return 'forgedThisRound';
        }
        return 'forgedLastRound';
      }
      return '';
    }

    getDelegatesData() {
      const { data } = this.props[delegatesKey];
      return data.map(delegate => ({
        ...delegate,
        status: this.getForgingStatus(delegate),
      }));
    }

    render() {
      const {
        latestBlocks, network, olderBlocksRetrieved: _, ...rest
      } = this.props;
      return (
        <ChildComponent {...{
          ...rest,
          [delegatesKey]: {
            ...this.props[delegatesKey],
            data: this.getDelegatesData(),
          },
        }}
        />
      );
    }
  }
  const mapStateToProps = ({ blocks: { latestBlocks }, network }) => ({
    latestBlocks,
    network,
  });

  const mapDispatchToProps = {
    olderBlocksRetrieved,
  };

  return connect(mapStateToProps, mapDispatchToProps)(DelegatesContainer);
};

export default withForgingStatus;
