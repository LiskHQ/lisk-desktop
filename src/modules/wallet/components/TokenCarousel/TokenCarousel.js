import React, { useMemo, useRef, useState } from 'react';
import Skeleton from 'src/modules/common/components/skeleton';
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

// eslint-disable-next-line max-statements
const Carousel = ({ renderItem: RenderItem, data = [], isLoading, error, ...rest }) => {
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
  const renderData = useMemo(() => (isLoading ? [...new Array(4).keys()] : data), [data]);

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>{error.message || error}</p>
      </div>
    );
  }
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
        {renderData.map((props, index) => (
          <SwiperSlide key={index}>
            {isLoading ? (
              <Skeleton className={styles.skeletonLoader} width="240px" height="96px" />
            ) : (
              <RenderItem {...props} />
            )}
          </SwiperSlide>
        ))}

        {isPrevVisible && !isLoading && (
          <NavButton
            ref={prevRef}
            onClick={() => {
              swiperInstance.current?.slidePrev();
              setSwiperIndex(swiperInstance.current?.activeIndex);
            }}
          />
        )}
        {isNextVisible && !isLoading && (
          <NavButton
            isNext
            ref={nextRef}
            onClick={() => {
              swiperInstance.current?.slideNext();
              setSwiperIndex(swiperInstance.current?.activeIndex);
            }}
          />
        )}
      </Swiper>
    </div>
  );
};

export default Carousel;
