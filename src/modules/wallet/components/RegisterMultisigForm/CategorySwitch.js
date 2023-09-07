import React from 'react';
import styles from './styles.css';

const CategorySwitch = ({ changeCategory, categories = [], value, index = 0 }) => (
  <div className={styles.categoryWrapper} onChange={changeCategory}>
    {categories.map((category) => (
      <>
        <input
          key={`${category.value}-${index}`}
          type="radio"
          id={`${category.value}-${index}`}
          name={`${category.label}-${index}`}
          value={category.value}
          checked={value === category.value}
        />
        <label
          key={`${category.value}-${index}`}
          htmlFor={`${category.value}-${index}`}
          className={`mandatory select-mandatory ${styles.memberCategory} mandatory-toggle`}
        >
          {category.label}
        </label>
      </>
    ))}
  </div>
);

export default CategorySwitch;
