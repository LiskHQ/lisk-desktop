import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import layout from './infoParagraph.css';

const InfoParagraph = props => (
  <div>
    <div className={`${layout['layout-row']} ${layout['layout-align-center-center']}`}>
      <span className={`${layout['layout-padding']} ${layout['layout-margin']}`}>
        <FontIcon className={layout['layout-margin']} value='info' />
      </span>
      <div className={`${layout['layout-padding']} ${layout['layout-margin']}`}>
        {props.children}
      </div>
    </div>
    <hr />
  </div>
);

export default InfoParagraph;
