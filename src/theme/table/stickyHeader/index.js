import React from 'react';
import LoadLatestButton from './loadLatestButton';
import styles from './stickyHeader.css';

const StickyHeader = ({
  title,
  button,
  filters,
  scrollToSelector,
}) => (
  <div className={styles.header}>
    <h1>{title}</h1>
    {// istanbul ignore next
      button && (
        <LoadLatestButton
          buttonClassName={`${styles.loadButton} ${button.className}`}
          entity={button.entity}
          onClick={() => {
            // When the header is fixed at the top, the position is 50px
            // Therefore the page should only scroll into the view if the header is not at the top
            if (document.querySelector(`.${styles.header}`).getBoundingClientRect().top - window.scrollY <= 50) {
              document.querySelector(scrollToSelector).scrollIntoView(true);
            }
            button.onClick();
          }}
        >
          {button.label}
        </LoadLatestButton>
      )
    }
    {filters}
  </div>
);

export default StickyHeader;
