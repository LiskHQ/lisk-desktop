import React from 'react';
import MovableShape from './movableShape';
import styles from './shapes.css';

const Shapes = ({ percentage }) =>
  (<div className={styles.shapesWrapper}>
    <MovableShape
      zIndex={3}
      idBg='big-circle-bg'
      idFg='big-circle-fg'
      group={
        <g transform="translate(-1437.000000, -746.000000)" >
          <g transform="translate(410.000000, 123.000000)">
            <g transform="translate(580.000000, 0.000000)">
              <g transform="translate(78.000000, 19.000000)">
                <ellipse fill="url(#big-circle-bg)" className={`${styles.shapeBackground}`} cx="442.480253" cy="678.71605" rx="73.4802533" ry="74.7160504" />
                <ellipse fill="url(#big-circle-fg)" className={`${styles.shapeForeground}`} cx="442.480253" cy="678.71605" rx="73.4802533" ry="74.7160504" />
              </g>
            </g>
          </g>
        </g>}
      backGroundIndex={2}
      foreGroundIndex={3}
      width='215px'
      height='215px'
      viewBox='0 0 147 150'
      className={styles.circle}
      percentage={percentage}
      initial={['100%', '20%']} >
    </MovableShape>
    <MovableShape
      zIndex={5}
      idBg='small-circle-bg'
      idFg='small-circle-fg'
      group={
        <g transform="translate(-467.000000, -806.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <ellipse fill="url(#small-circle-bg" className={`${styles.shapeBackground}`} cx="192" cy="701" rx="40" ry="41" />
            <ellipse fill="url(#small-circle-fg" className={`${styles.shapeForeground}`} cx="192" cy="701" rx="40" ry="41" />
          </g>
        </g>}
      backGroundIndex={2}
      foreGroundIndex={3}
      width='80px'
      height='82px'
      viewBox='0 0 80 82'
      className={styles.smallCircle}
      percentage={percentage}
      initial={['62%', '-2%']} />
    <MovableShape
      zIndex={3}
      idBg='triangle-bg'
      idFg='triangle-fg'
      group={
        <g transform="translate(-1355.000000, -704.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <polygon fill="url(#triangle-bg)" className={`${styles.shapeBackground}`} transform="translate(1128.068314, 616.047499) rotate(-345.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1203.56831 674.547499 1052.56831 674.547499"/>
            <polygon fill="url(#triangle-fg)" className={`${styles.shapeForeground}`} transform="translate(1128.068314, 616.047499) rotate(-345.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1203.56831 674.547499 1052.56831 674.547499"/>
          </g>
        </g>}
      backGroundIndex={4}
      foreGroundIndex={5}
      width='146px'
      height='135px'
      viewBox='0 0 146 135'
      className={styles.triangle}
      percentage={percentage}
      initial={['80%', '-2%']} />
    <MovableShape
      zIndex={1}
      idBg='square-left-bg'
      idFg='square-left-fg'
      group={
        <g transform="translate(-1165.000000, -676.000000)" >
          <g transform="translate(315.000000, 146.000000)">
            <rect fill="url(#square-left-bg)" className={`${styles.shapeBackground}`} transform="translate(944.637722, 561.361314) rotate(-345.000000) translate(-944.637722, -561.361314) " x="880" y="490" width="100" height="100"/>
            <rect fill="url(#square-left-fg)" className={`${styles.shapeForeground}`} transform="translate(944.637722, 561.361314) rotate(-345.000000) translate(-944.637722, -561.361314) " x="880" y="490" width="100" height="100"/>
          </g>
        </g>}
      backGroundIndex={3}
      foreGroundIndex={4}
      width='200px'
      height='200px'
      viewBox='0 0 189 63'
      className={styles.squareLeft}
      percentage={percentage}
      initial={['5%', '-1%']} />
    <MovableShape
      zIndex={4}
      idBg='square-right-bg'
      idFg='square-right-fg'
      group={
        <g transform="translate(-363.000000, -600.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <rect fill="url(#square-right-bg)" className={`${styles.shapeBackground}`} transform="translate(120.124210, 526.124210) rotate(-45.000000) translate(-120.124210, -526.124210) " x="90" y="470" width="60" height="60"/>
            <rect fill="url(#square-right-fg)" className={`${styles.shapeForeground}`} transform="translate(120.124210, 526.124210) rotate(-45.000000) translate(-120.124210, -526.124210) " x="90" y="470" width="60" height="60"/>
          </g>
        </g>}
      backGroundIndex={0}
      foreGroundIndex={1}
      width='145px'
      height='145px'
      viewBox='0 0 145 145'
      className={styles.squareRight}
      percentage={percentage}
      initial={['70%', '-5%']} />
    <MovableShape
      zIndex={2}
      idBg='triangle-left-bg'
      idFg='triangle-left-fg'
      group={
        <g transform="translate(-1355.000000, -704.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <polygon fill="url(#triangle-left-bg)" className={`${styles.shapeBackground}`} transform="translate(1128.068314, 616.047499) rotate(-320.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1180.56831 670.547499 1050.56831 650.547499"/>
            <polygon fill="url(#triangle-left-fg)" className={`${styles.shapeForeground}`} transform="translate(1128.068314, 616.047499) rotate(-320.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1180.56831 670.547499 1050.56831 650.547499"/>
          </g>
        </g>}
      backGroundIndex={0}
      foreGroundIndex={1}
      width='160px'
      height='180px'
      viewBox='0 0 146 135'
      className={styles.triangleLeft}
      percentage={percentage}
      initial={['-2%', '30%']} />
    <MovableShape
      zIndex={1}
      idBg='circle-left-bg'
      idFg='circle-left-fg'
      group={
        <g transform="translate(-467.000000, -806.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <ellipse fill="url(#circle-left-bg)" className={`${styles.shapeBackground}`} cx="192" cy="701" rx="40" ry="41"/>
            <ellipse fill="url(#circle-left-fg)" className={`${styles.shapeForeground}`} cx="192" cy="701" rx="40" ry="41"/>
          </g>
        </g>}
      backGroundIndex={3}
      foreGroundIndex={4}
      width='80px'
      height='82px'
      viewBox='0 0 80 82'
      className={styles.circleLeft}
      percentage={percentage}
      initial={['20%', '2%']} />
    <MovableShape
      zIndex={1}
      idBg='small-triangle-bg'
      idFg='small-triangle-fg'
      group={
        <g transform="translate(-1333.000000, -767.000000)" >
          <g transform="translate(315.000000, 146.000000)">
            <polygon fill="url(#small-triangle-bg)" className={`${styles.shapeBackground}`} transform="translate(1039.959376, 649.345689) rotate(-30.000000) translate(-1039.959376, -649.345689) " points="1037.77139 615.371723 1083.80612 683.319655 996.112633 683.319655"/>
            <polygon fill="url(#small-triangle-fg)" className={`${styles.shapeForeground}`} transform="translate(1039.959376, 649.345689) rotate(-30.000000) translate(-1039.959376, -649.345689) " points="1037.77139 615.371723 1083.80612 683.319655 996.112633 683.319655"/>
          </g>
        </g>}
      backGroundIndex={2}
      foreGroundIndex={3}
      width='77px'
      height='80px'
      viewBox='0 0 77 80'
      className={styles.smallTriangle}
      percentage={percentage}
      initial={['40%', '-2%']} />
    <MovableShape
      zIndex={4}
      idBg='very-small-circle-bg'
      idFg='very-small-circle-fg'
      group={
        <g transform="translate(-467.000000, -806.000000)">
          <g transform="translate(315.000000, 146.000000)">
            <ellipse fill="url(#very-small-circle-bg)" className={`${styles.shapeBackground}`} cx="192" cy="701" rx="40" ry="41"/>
            <ellipse fill="url(#very-small-circle-fg)" className={`${styles.shapeForeground}`} cx="192" cy="701" rx="40" ry="41"/>
          </g>
        </g>}
      backGroundIndex={1}
      foreGroundIndex={2}
      width='50px'
      height='50px'
      viewBox='0 0 80 82'
      className={styles.verySmallCircle}
      percentage={percentage}
      initial={['45%', '0%']} />
  </div>);

export default Shapes;
