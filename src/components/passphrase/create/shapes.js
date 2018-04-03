import React from 'react';
import * as shapesSrc from '../../../assets/images/register-shapes/*.svg'; //eslint-disable-line
import MovableShape from './movableShape';
import styles from './shapes.css';

const Shapes = ({ shapes, percentage }) =>
  (<div className={styles.shapesWrapper}>
    <MovableShape
      hidden={shapes[0]}
      src={shapesSrc.circle}
      className={styles.circle}
      percentage={percentage}
      initial={['100%', '20%']} />
    <MovableShape
      hidden={shapes[1]}
      src={shapesSrc.smallCircle}
      className={styles.smallCircle}
      percentage={percentage}
      initial={['62%', '-2%']} />
    <MovableShape
      hidden={shapes[2]}
      src={shapesSrc.triangle}
      className={styles.triangle}
      percentage={percentage}
      initial={['80%', '-2%']} />
    <MovableShape
      hidden={shapes[4]}
      src={shapesSrc.squareLeft}
      className={styles.squareLeft}
      percentage={percentage}
      initial={['5%', '-1%']} />
    <MovableShape
      hidden={shapes[8]}
      src={shapesSrc.squareRight}
      className={styles.squareRight}
      percentage={percentage}
      initial={['70%', '-5%']} />
    <MovableShape
      hidden={shapes[5]}
      src={shapesSrc.triangleLeft}
      className={styles.triangleLeft}
      percentage={percentage}
      initial={['-2%', '30%']} />
    <MovableShape
      hidden={shapes[7]}
      src={shapesSrc.circleLeft}
      className={styles.circleLeft}
      percentage={percentage}
      initial={['20%', '2%']} />
    <MovableShape
      hidden={shapes[3]}
      src={shapesSrc.smallTriangle}
      className={styles.smallTriangle}
      percentage={percentage}
      initial={['40%', '-2%']} />
    <MovableShape
      hidden={shapes[6]}
      src={shapesSrc.verySmallCircle}
      className={styles.verySmallCircle}
      percentage={percentage}
      initial={['45%', '0%']} />
  </div>);

export default Shapes;
