import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import buttonStyle from 'react-toolbox/lib/button/theme.css';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import dialogs from '../dialog/dialogs';

const RelativeLink = ({
  location, to, children, className, raised, neutral, primary, flat, disableWhenOffline,
}) => {
  let style = '';
  if (raised !== undefined) style += `${buttonStyle.raised} `;
  if (neutral !== undefined) style += `${buttonStyle.neutral} `;
  if (flat !== undefined) style += `${buttonStyle.flat} `;
  if (primary !== undefined) style += `${buttonStyle.primary} `;
  if (disableWhenOffline !== undefined) style += `${offlineStyle.disableWhenOffline} `;
  if (style !== '') style += ` ${buttonStyle.button}`;

  const dialogNames = Object.keys(dialogs());
  let pathname = location.pathname;
  dialogNames.forEach((dialog) => {
    pathname = pathname.replace(`/${dialog}`, '');
  });

  const path = `${pathname}/${to}`.replace('//', '/');
  return (
    <Link className={`${className} ${style}`} to={path}>{ children }</Link>
  );
};

const mapStateToProps = state => ({
  dialog: state.dialog,
});

export default withRouter(connect(mapStateToProps)(RelativeLink));
