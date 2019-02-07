import React from 'react';
import styles from './banner.css';

const Banner = ({
  title, children, footer, className = '',
  onClose,
}) => (
  <section className={`${styles.banner} ${className}`}>
    <header>
      <h1 className={`${styles.title}`}>
        {title}
      </h1>
      { onClose ? <span
        onClick={onClose}
        className={`${styles.closeBtn} banner-close`} /> : null}
    </header>
    <main className={`${styles.content}`}>
      { children }
    </main>
    <footer>
      { footer }
    </footer>
  </section>
);

export default Banner;
