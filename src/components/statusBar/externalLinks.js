import React from 'react';
import { Link } from 'react-router-dom';
import styles from './externalLinks.css';

const ExternalLinks = props => (
  <section className={styles.wrapper}>
    {
      props.links.map((link, index) => {
        if (link.internal) {
          return (
            <Link
              id={link.id}
              key={index}
              to={`${link.path}`}
            >
              {link.icon && <img src={link.icon}/>}
              {link.label}
            </Link>
          );
        }

        return (
          <a
            href={link.path}
            id={link.id}
            key={index}
            target='_blank'
            rel='noopener noreferrer'
          >
            {link.icon && <img src={link.icon}/>}
            {link.label}
          </a>
        );
      })
    }
  </section>
);

export default ExternalLinks;
