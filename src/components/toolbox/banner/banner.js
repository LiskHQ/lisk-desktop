import React from 'react';
import styles from './banner.css';

const Banner = ({
  title, children, footer, className,
}) => (
  <section className={`${styles.banner} ${className}`}>
    <header>
      <h1 className={`${styles.title}`}>
        {title}
      </h1>
    </header>
    <main className={`${styles.content}`}>
      { children }
    </main>
    <footer className={`${styles.footer}`}>
      { footer }
    </footer>
  </section>
);

export default Banner;
