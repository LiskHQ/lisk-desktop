import React from 'react';
import MovableShape from './movableShape';
import styles from './shapes.css';

const Shapes = ({ shapes, percentage }) =>
  (<div className={styles.shapesWrapper}>
    <MovableShape
      hidden={shapes[0]}
      id='big-circle'
      group={
        <g id="Get-Access-Dashboard-1-Lisk-XL" transform="translate(-1437.000000, -746.000000)" fill="url(#big-circle)">
          <g id="Group-18" transform="translate(410.000000, 123.000000)">
            <g id="Group-3" transform="translate(580.000000, 0.000000)">
              <g id="Group-5" transform="translate(78.000000, 19.000000)">
                <g id="Group">
                  <ellipse id="Oval-5" cx="442.480253" cy="678.71605" rx="73.4802533" ry="74.7160504"></ellipse>
                </g>
              </g>
            </g>
          </g>
        </g>}
      gradients1='#FFD300;#F792A6;#C86DD7;#004AFF;#008BFF;#4D3AFF;#F792A6;#FFD300'
      gradients2='#FF9100;#EC596D;#3023AE;#93F4FE;#00EDFF;#8480FF;#EC596D;#FF9100'
      color1='#FFD300'
      color2='#FF9100'
      width='215px'
      height='215px'
      viewBox='0 0 147 150'
      className={styles.circle}
      percentage={percentage}
      initial={['100%', '20%']} >
    </MovableShape>
    <MovableShape
      hidden={shapes[1]}
      id='smallCircle'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-467.000000, -806.000000)" fill="url(#smallCircle)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <ellipse id="shape-2" cx="192" cy="701" rx="40" ry="41"></ellipse>
          </g>
        </g>}
      gradients1='#F792A6;#C86DD7;#4D3AFF;#004AFF;#008BFF;#93F4FE;#96F7E1;#FFF8CF;#FFD300;#F792A6'
      gradients2='#EC596D;#3023AE;#8480FF;#93F4FE;#4D3AFF;#004AFF;#5DECBF;#FFD23A;#FF9100;#EC596D'
      color1='#FAD961'
      color2='#F76B1C'
      width='80px'
      height='82px'
      viewBox='0 0 80 82'
      className={styles.smallCircle}
      percentage={percentage}
      initial={['62%', '-2%']} />
    <MovableShape
      hidden={shapes[2]}
      id='triangle'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-1355.000000, -704.000000)" fill="url(#triangle)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <polygon id="triangle" transform="translate(1128.068314, 616.047499) rotate(-345.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1203.56831 674.547499 1052.56831 674.547499"></polygon>
          </g>
        </g>}
      gradients1='#F792A6;#C86DD7;#4D3AFF;#004AFF;#008BFF;#93F4FE;#96F7E1;#FFF8CF;#FFD300;#F792A6'
      gradients2='#EC596D;#3023AE;#8480FF;#93F4FE;#4D3AFF;#004AFF;#5DECBF;#FFD23A;#FF9100;#EC596D'
      color1='#00EDFF'
      color2='#008BFF'
      width='146px'
      height='135px'
      viewBox='0 0 146 135'
      className={styles.triangle}
      percentage={percentage}
      initial={['80%', '-2%']} />
    <MovableShape
      hidden={shapes[4]}
      id='square-left'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-1165.000000, -676.000000)" fill="url(#square-left)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <rect id="Rectangle-Copy" transform="translate(944.637722, 561.361314) rotate(-345.000000) translate(-944.637722, -561.361314) " x="880" y="490" width="100" height="100"></rect>
          </g>
        </g>}
      gradients1='#F792A6;#C86DD7;#4D3AFF;#004AFF;#008BFF;#93F4FE;#96F7E1;#FFF8CF;#FFD300;#F792A6'
      gradients2='#EC596D;#3023AE;#8480FF;#93F4FE;#4D3AFF;#004AFF;#5DECBF;#FFD23A;#FF9100;#EC596D'
      color1='#FFD300'
      color2='#FF9100'
      width='200px'
      height='200px'
      viewBox='0 0 189 63'
      className={styles.squareLeft}
      percentage={percentage}
      initial={['5%', '-1%']} />
    <MovableShape
      hidden={shapes[8]}
      id='square-right'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-363.000000, -600.000000)" fill="url(#square-right)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <rect id="shape-1" transform="translate(120.124210, 526.124210) rotate(-45.000000) translate(-120.124210, -526.124210) " x="90" y="470" width="60" height="60"></rect>
          </g>
        </g>}
      gradients1='#C86DD7;#004AFF;#008BFF;#4D3AFF;#F792A6;#FFD300;#F792A6;#C86DD7'
      gradients2='#3023AE;#93F4FE;#00EDFF;#8480FF;#EC596D;#FF9100;#EC596D;#3023AE'
      color1='#3023AE'
      color2='#C86DD7'
      width='145px'
      height='145px'
      viewBox='0 0 145 145'
      className={styles.squareRight}
      percentage={percentage}
      initial={['70%', '-5%']} />
    <MovableShape
      hidden={shapes[5]}
      id='triangle-left'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-1355.000000, -704.000000)" fill="url(#triangle-left)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <polygon id="triangle" transform="translate(1128.068314, 616.047499) rotate(-320.000000) translate(-1128.068314, -616.047499) " points="1124.3008 557.547499 1180.56831 670.547499 1050.56831 650.547499"></polygon>
          </g>
        </g>}
      gradients1='#FFD300;#F792A6;#C86DD7;#004AFF;#008BFF;#4D3AFF;#F792A6;#FFD300'
      gradients2='#FF9100;#EC596D;#3023AE;#93F4FE;#00EDFF;#8480FF;#EC596D;#FF9100'
      color1='#4D3AFF'
      color2='#8480FF'
      width='160px'
      height='180px'
      viewBox='0 0 146 135'
      className={styles.triangleLeft}
      percentage={percentage}
      initial={['-2%', '30%']} />
    <MovableShape
      hidden={shapes[7]}
      id='circle-left'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-467.000000, -806.000000)" fill="url(#circle-left)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <ellipse id="shape-2" cx="192" cy="701" rx="40" ry="41"></ellipse>
          </g>
        </g>}
      gradients1='#F792A6;#C86DD7;#4D3AFF;#004AFF;#008BFF;#93F4FE;#96F7E1;#FFF8CF;#FFD300;#F792A6'
      gradients2='#EC596D;#3023AE;#8480FF;#93F4FE;#4D3AFF;#004AFF;#5DECBF;#FFD23A;#FF9100;#EC596D'
      color1='#00EDFF'
      color2='#008BFF'
      width='80px'
      height='82px'
      viewBox='0 0 80 82'
      className={styles.circleLeft}
      percentage={percentage}
      initial={['20%', '2%']} />
    <MovableShape
      hidden={shapes[3]}
      id='smallTriangle'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-1333.000000, -767.000000)" fill="url(#smallTriangle)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <polygon id="Triangle-2-Copy" transform="translate(1039.959376, 649.345689) rotate(-30.000000) translate(-1039.959376, -649.345689) " points="1037.77139 615.371723 1083.80612 683.319655 996.112633 683.319655"></polygon>
          </g>
        </g>}
      gradients1='#5DECBF;#FFD23A;#FF9100;#EC596D;#EC596D;#3023AE;#8480FF;#93F4FE;#4D3AFF;#004AFF;#5DECBF'
      gradients2='#96F7E1;#FFF8CF;#FFD300;#F792A6;#F792A6;#C86DD7;#4D3AFF;#004AFF;#008BFF;#93F4FE;#96F7E1'
      color1='#F792A6'
      color2='#EC596D'
      width='77px'
      height='80px'
      viewBox='0 0 77 80'
      className={styles.smallTriangle}
      percentage={percentage}
      initial={['40%', '-2%']} />
    <MovableShape
      hidden={shapes[6]}
      id='verySmallCircle'
      group={
        <g id="Get-Access-Dashboard-2-Lisk-XL" transform="translate(-467.000000, -806.000000)" fill="url(#verySmallCircle)">
          <g id="Group" transform="translate(315.000000, 146.000000)">
            <ellipse id="shape-2" cx="192" cy="701" rx="40" ry="41"></ellipse>
          </g>
        </g>}
      gradients1='#C86DD7;#004AFF;#008BFF;#4D3AFF;#F792A6;#FFD300;#F792A6;#C86DD7'
      gradients2='#3023AE;#93F4FE;#00EDFF;#8480FF;#EC596D;#FF9100;#EC596D;#3023AE'
      color1='#92BEFF'
      color2='#598AFF'
      width='50px'
      height='50px'
      viewBox='0 0 80 82'
      className={styles.verySmallCircle}
      percentage={percentage}
      initial={['45%', '0%']} />
  </div>);

export default Shapes;
