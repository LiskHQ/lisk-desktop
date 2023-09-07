import React from 'react';
import styles from './styles.css';

const CategorySwitch = ({ changeCategory, categories = [], value, index = 0 }) => (
  <div className={styles.categoryWrapper} onChange={changeCategory}>
    {categories.map((category, i) => (
      <React.Fragment key={i}>
        <input
          key={`input-${category.value}-${index + i}`}
          type="radio"
          id={`${category.value}-${index + i}`}
          name={`${category.label}-${index + i}`}
          value={category.value}
          checked={value === category.value}
        />
        <label
          key={`label-${category.value}-${index + i}`}
          htmlFor={`${category.value}-${index + i}`}
          className={`mandatory select-mandatory ${styles.memberCategory} mandatory-toggle`}
        >
          {category.label}
        </label>
      </React.Fragment>
    ))}
  </div>
);

export default CategorySwitch;
