import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

const InfoParagraph = props => (
  <div>
    <div className='layout-row layout-align-center-center'>
      <span className='layout-padding layout-margin'>
        <FontIcon className='layout-margin' value='info' />
      </span>
      <p className='layout-padding layout-margin'>
        {props.children}
      </p>
    </div>
    <hr />
  </div>
);

export default InfoParagraph;
