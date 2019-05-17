import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';

class VotingHeader extends React.Component {
  render() {
    const { t, votes } = this.props;
    return (
      <div className={`${grid.row} ${grid['between-xs']}`}>
        <div className={`${grid['col-sm-12']} ${grid['col-md-12']} `}>
          <div className={`${grid.row} ${grid['between-xs']}`}>
            <span>
              <h2>{Object.keys(votes).length}/101</h2>
              <div>{t('My votes after confirmation')}</div>
            </span>
            <span>
              <SecondaryButtonV2>
                {t('Register as a Delegate')}
              </SecondaryButtonV2>
              <PrimaryButtonV2>
                {t('Start voting')}
              </PrimaryButtonV2>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default VotingHeader;
