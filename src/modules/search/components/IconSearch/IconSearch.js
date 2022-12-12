import React from 'react';
import styles from './IconSearch.css';

function IconSearch() {
  return (
    <svg
      className={styles.IconSearch}
      width="20"
      height="20"
      stroke="#C5CFE4"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.22222 15.4444C12.6587 15.4444 15.4444 12.6587 15.4444 9.22222C15.4444 5.78578 12.6587 3 9.22222 3C5.78578 3 3 5.78578 3 9.22222C3 12.6587 5.78578 15.4444 9.22222 15.4444Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0005 17.0005L13.6172 13.6172"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IconSearch;
