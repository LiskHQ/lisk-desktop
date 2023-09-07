import React from 'react';
import styles from './styles.css';

const CategorySwitch = ({ onChangeCategory, categories = [], value, index = 0 }) => (
  <div className={styles.categoryWrapper}>
    {categories.map((category, i) => (
      <React.Fragment key={i}>
        <input
          key={`input-${category.value}-${index + i}`}
          type="radio"
          id={`${category.value}-${index + i}`}
          name={`${category.label}-${index + i}`}
          value={category.value}
          checked={value === category.value}
          onChange={onChangeCategory}
          className={`select-${category.value}-input`}
        />
        <label
          key={`label-${category.value}-${index + i}`}
          htmlFor={`${category.value}-${index + i}`}
          className={`${category.value} select-${category.value} ${styles.memberCategory} mandatory-toggle`}
        >
          {category.label}
        </label>
      </React.Fragment>
    ))}
  </div>
);

export default CategorySwitch;
