import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../constants/routes';
import Tooltip from '../../toolbox/tooltip/tooltip';
import styles from './signInTooltipWrapper.css';

const SignInTooltipWrapper = ({
  children, account, t, history,
}) => {
  const { pathname, search } = history.location;
  return account && account.info
    ? children
    : (
      <Tooltip
        className={styles.wrapper}
        position="bottom left"
        content={React.cloneElement(children, { className: `${children.props.className} ${styles.child} disabled` })}
        title={t('Please sign in')}
        footer={(
          <Link to={`${routes.login.path}?referrer=${pathname}${encodeURIComponent(search)}`}>
            {t('Sign in')}
          </Link>
)}
      >
        <p>{t('In order to use this Lisk feature you need to sign in to your Lisk account.')}</p>
      </Tooltip>
    );
};

export default SignInTooltipWrapper;
