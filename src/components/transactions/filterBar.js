import React from 'react';

const FilterBar = props => (
  <div>
    {Object.values(props.filters).map((filter, index) =>
      <div key={filter + index}>{filter}</div>)
    }
  </div>);

export default FilterBar;
