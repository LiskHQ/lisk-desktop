import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import plusShapeIcon from '../../assets/images/plus-shape.svg';
import circleImage from '../../assets/images/add-id-oval.svg';
import rectangleOnTheRight from '../../assets/images/add-id-rectangle-1.svg';
import rectangleImage2 from '../../assets/images/add-id-rectangle-2.svg';
import rectangleImage3 from '../../assets/images/add-id-rectangle-3.svg';
import triangleImage from '../../assets/images/add-id-triangle.svg';
import styles from './card.css';

const AddAccountCard = ({ t }) =>
  (<li>
    <Link to={`${routes.addAccount.path}?referrer=${routes.main.path}${routes.dashboard.path}/`} >
      <div className={`add-lisk-id-card ${styles.card} ${styles.addNew}`} >
        <div className={styles.cardIcon}>
          <img src={plusShapeIcon} className={styles.plusShapeIcon} />
        </div>
        <img src={rectangleOnTheRight} className={styles.rectangleOnTheRight} />
        <img src={rectangleImage2} className={styles.rectangleImage2} />
        <img src={rectangleImage3} className={styles.rectangleImage3} />
        <img src={triangleImage} className={styles.triangleImage} />
        <img src={circleImage} className={styles.circleImage} />
        <h2 className={styles.addTittle} >{t('Add a Lisk ID')}</h2>
      </div>
    </Link>
  </li>);

export default AddAccountCard;
