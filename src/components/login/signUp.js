import React from 'react';
import Parallax from '../parallax';
import { FontIcon } from '../fontIcon';
// eslint-disable-next-line import/no-unresolved
import * as shapes from '../../assets/images/*.svg';
import styles from './signUp.css';

const SignUp = ({ t, passInputState, validateCorrectNode }) => (<section className={`${styles.signUp} ${styles[passInputState]}`}>
    <section className={styles.table}>
      <div className='text-left'>
        <h2>
          <span
            className={`new-account-button ${styles.link}`}
            onClick={() => { validateCorrectNode(); }} >
            {t('Create Lisk ID')}
          </span>
          <FontIcon className={styles.singUpArrow} value='arrow-right' />
        </h2>

        <div className={styles.subTitle}>
          {t('Create a Lisk ID to gain access to all services.')}
        </div>
      </div>
    </section>
    <div className={styles.bg}></div>
    <div className={styles.shapes}>
      <Parallax bgWidth='200px' bgHeight='10px'>
        <figure className={`${styles.shape} ${styles.circle}`} data-depth='0.5'>
          <img src={shapes.circle} alt='circle'/>
        </figure>
        <figure className={`${styles.shape} ${styles.triangle}`} data-depth='0.6'>
          <img src={shapes.triangle} alt='triangle'/>
        </figure>
        <figure className={`${styles.shape} ${styles.rectA}`} data-depth='0.2'>
          <img src={shapes.rect} alt='rect A'/>
        </figure>
        <figure className={`${styles.shape} ${styles.rectB}`} data-depth='0.8'>
          <img src={shapes.rect} alt='rect B'/>
        </figure>
        <figure className={`${styles.shape} ${styles.rectC}`} data-depth='1.5'>
          <img src={shapes.rect} alt='rect C' />
        </figure>
      </Parallax>
    </div>
  </section>);

export default SignUp;
