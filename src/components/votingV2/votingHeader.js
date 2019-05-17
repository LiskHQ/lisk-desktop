import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import routes from './../../constants/routes';

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
              <Link to={routes.registerDelegate.path} >
                <SecondaryButtonV2 className='register-delegate'>
                  {t('Register as a Delegate')}
                </SecondaryButtonV2>
              </Link>
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
