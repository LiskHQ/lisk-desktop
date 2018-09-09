import React from 'react';
import MovableShape from './movableShape';
import styles from './shapes.css';

const Shapes = ({ percentage, addressCreated }) => (<div
  className={`${styles.shapesWrapper} ${percentage >= 100 && addressCreated ? styles.fadeOut : null}`}>
  <MovableShape
    zIndex={3}
    idBg='big-circle-bg'
    idFg='big-circle-fg'
    group={
      <g opacity="0.9">
        <ellipse fill="url(#big-circle-bg)" className={`${styles.shapeBackground}`} cx="100" cy="100" rx="100"
          ry="100"/>
        <ellipse fill="url(#big-circle-fg)" className={`${styles.shapeForeground}`} cx="100" cy="100" rx="100"
          ry="100"/>
      </g>}
    backGroundIndex={2}
    foreGroundIndex={3}
    width='150'
    height='150'
    className={styles.circle}
    percentage={percentage}
    initial={['100%', '20%']}>
  </MovableShape>
  <MovableShape
    zIndex={1}
    idBg='small-circle-bg'
    idFg='small-circle-fg'
    group={
      <g opacity="0.9">
        <ellipse fill="url(#small-circle-bg" className={`${styles.shapeBackground}`} cx="50" cy="50" rx="50" ry="50"/>
        <ellipse fill="url(#small-circle-fg" className={`${styles.shapeForeground}`} cx="50" cy="50" rx="50" ry="50"/>
      </g>}
    backGroundIndex={2}
    foreGroundIndex={3}
    width='140'
    height='140'
    className={styles.smallCircle}
    percentage={percentage}
    initial={['62%', '-2%']}/>
  <MovableShape
    zIndex={3}
    idBg='triangle-bg'
    idFg='triangle-fg'
    group={
      <g opacity="0.9">
        <polygon fill="url(#triangle-bg)" points="0 125, 100 40, 130 160"/>
        <polygon fill="url(#triangle-fg)" points="0 125, 100 40, 130 160"/>
      </g>}
    backGroundIndex={4}
    foreGroundIndex={5}
    width='180'
    height='180'
    className={styles.triangle}
    percentage={percentage}
    initial={['80%', '5%']}/>
  <MovableShape
    zIndex={1}
    idBg='square-left-bg'
    idFg='square-left-fg'
    group={
      <g opacity="0.9">
        <rect fill="url(#square-left-bg)" className={`${styles.shapeBackground}`} transform="rotate(-345)" x="50"
          y="0" width="100" height="100"/>
        <rect fill="url(#square-left-fg)" className={`${styles.shapeForeground}`} transform="rotate(-345)" x="50"
          y="0" width="100" height="100"/>
      </g>}
    backGroundIndex={3}
    foreGroundIndex={4}
    width='200'
    height='200'
    className={styles.squareLeft}
    percentage={percentage}
    initial={['5%', '-1%']}/>
  <MovableShape
    zIndex={4}
    idBg='square-right-bg'
    idFg='square-right-fg'
    group={
      <g opacity="0.9">
        <rect fill="url(#square-right-bg)" className={`${styles.shapeBackground}`} transform="rotate(-48)" x="-25"
          y="60" width="60" height="60"/>
        <rect fill="url(#square-right-fg)" className={`${styles.shapeForeground}`} transform="rotate(-48)" x="-25"
          y="60" width="60" height="60"/>
      </g>}
    backGroundIndex={0}
    foreGroundIndex={1}
    width='145'
    height='145'
    className={styles.squareRight}
    percentage={percentage}
    initial={['70%', '-5%']}/>
  <MovableShape
    zIndex={2}
    idBg='triangle-left-bg'
    idFg='triangle-left-fg'
    group={
      <g opacity="0.9">
        <polygon fill="url(#triangle-left-bg)" className={`${styles.shapeBackground}`}
          transform="rotate(15, 315, 140)" points="0 155, 130 50, 170 210"/>
        <polygon fill="url(#triangle-left-fg)" className={`${styles.shapeForeground}`}
          transform="rotate(15, 315, 140)" points="0 155, 130 50, 170 210"/>
      </g>}
    backGroundIndex={0}
    foreGroundIndex={1}
    width='180'
    height='180'
    className={styles.triangleLeft}
    percentage={percentage}
    initial={['-2%', '30%']}/>
  <MovableShape
    zIndex={1}
    idBg='circle-left-bg'
    idFg='circle-left-fg'
    group={
      <g opacity="0.9">
        <ellipse fill="url(#circle-left-bg)" className={`${styles.shapeBackground}`} cx="40" cy="40" rx="40" ry="40"/>
        <ellipse fill="url(#circle-left-fg)" className={`${styles.shapeForeground}`} cx="40" cy="40" rx="40" ry="40"/>
      </g>}
    backGroundIndex={3}
    foreGroundIndex={4}
    width='80'
    height='80'
    className={styles.circleLeft}
    percentage={percentage}
    initial={['20%', '2%']}/>
  <MovableShape
    zIndex={1}
    idBg='small-triangle-bg'
    idFg='small-triangle-fg'
    group={
      <g opacity="0.9">
        <polygon fill="url(#small-triangle-bg)" className={`${styles.shapeBackground}`}
          transform="rotate(50, 115, 140)" points="20 130, 100 90, 80 190"/>
        <polygon fill="url(#small-triangle-fg)" className={`${styles.shapeForeground}`}
          transform="rotate(50, 115, 140)" points="20 130, 100 90, 80 190"/>
      </g>}
    backGroundIndex={2}
    foreGroundIndex={3}
    width='180'
    height='180'
    className={styles.smallTriangle}
    percentage={percentage}
    initial={['40%', '-2%']}/>
  <MovableShape
    zIndex={4}
    idBg='very-small-circle-bg'
    idFg='very-small-circle-fg'
    group={
      <g opacity="0.9">
        <ellipse fill="url(#very-small-circle-bg)" className={`${styles.shapeBackground}`} cx="26" cy="26" rx="26"
          ry="26"/>
        <ellipse fill="url(#very-small-circle-fg)" className={`${styles.shapeForeground}`} cx="26" cy="26" rx="26"
          ry="26"/>
      </g>}
    backGroundIndex={1}
    foreGroundIndex={2}
    width='80'
    height='80'
    className={styles.verySmallCircle}
    percentage={percentage}
    initial={['45%', '0%']}/>
</div>);

export default Shapes;
