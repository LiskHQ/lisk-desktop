import React, { useMemo, useRef, useState } from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './TokenCarousel.css';

const NavButton = React.forwardRef(({ isNext, onClick }, ref) => (
  <div
    ref={ref}
    className={`${styles.navButtonWrapper} ${styles[isNext ? 'rightNav' : 'leftNav']}`}
  >
    <TertiaryButton onClick={onClick}>
      <Icon name="arrowLeftTailed" />
    </TertiaryButton>
  </div>
));

const Carousel = ({ renderItem: RenderItem, data = [], ...rest }) => {
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const swiperInstance = useRef(null);
  const { virtualSize, width, activeIndex } = swiperInstance.current || {};
  const [, setSwiperIndex] = useState(null);
  const isNextVisible = useMemo(
    () => Math.floor(virtualSize / width) > activeIndex + 1,
    [virtualSize, width, activeIndex]
  );
  const isPrevVisible = useMemo(() => activeIndex > 0, [activeIndex]);

  return (
    <div className={styles.wrapper}>
      <Swiper
        className={styles.swiperWrapper}
        slidesPerView={2}
        spaceBetween={20}
        modules={[Navigation]}
        onSlideChange={(ref) => {
          swiperInstance.current = ref;
          setSwiperIndex(ref.activeIndex);
        }}
        onSwiper={(swiperRef) => {
          swiperRef.params.navigation.prevEl = prevRef.current;
          swiperRef.params.navigation.nextEl = nextRef.current;
          swiperRef.navigation.update();
          swiperInstance.current = swiperRef;
        }}
        {...rest}
      >
        {data.map((props, index) => (
          <SwiperSlide key={index}>
            <RenderItem {...props} />
          </SwiperSlide>
        ))}

        {isPrevVisible && (
          <NavButton
            ref={prevRef}
            onClick={() => {
              swiperInstance.current?.slidePrev();
              setSwiperIndex(swiperInstance.current.activeIndex);
            }}
          />
        )}
        {isNextVisible && (
          <NavButton
            isNext
            ref={nextRef}
            onClick={() => {
              swiperInstance.current?.slideNext();
              setSwiperIndex(swiperInstance.current.activeIndex);
            }}
          />
        )}
      </Swiper>
    </div>
  );
};

export default Carousel;
