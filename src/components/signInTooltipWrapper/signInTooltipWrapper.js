import React from 'react';
import { Link } from 'react-router-dom';
import routes from './../../constants/routes';
import Tooltip from '../toolbox/tooltip/tooltip';

const SignInTooltipWrapper = ({
  children, account, t, history,
}) => {
  const { pathname, search } = history.location;
  return <React.Fragment>
    { account && account.address ?
      children :
      <span>
        <Tooltip
          className='showOnBottom'
          content={
            <span style={{ pointerEvents: 'none' }}>
              {children}
            </span>}
          title={t('Please sign in')}
          footer={
            <Link to={`${routes.loginV2.path}?referrer=${pathname}${encodeURIComponent(search)}`}>
              {t('Sign in')}
            </Link>
          }
          >
          <p>{t('In order to use this Lisk Hub feature you need to sign in to your Lisk account.')}</p>
        </Tooltip>
      </span>}
    </React.Fragment>;
};

export default SignInTooltipWrapper;
