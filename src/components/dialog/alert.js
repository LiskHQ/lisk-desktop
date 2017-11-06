import { translate } from 'react-i18next';
import Button from 'react-toolbox/lib/button';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';


const Alert = ({ text, closeDialog, t }) => (
  <div>
    <p className='alert-dialog-message'>{text}</p>
    <br />
    <section className={`${grid.row} ${grid['between-xs']}`}>
      <span />
      <Button label={t('Ok')} onClick={closeDialog} className='ok-button'/>
    </section>
  </div>
);

export default translate()(Alert);
