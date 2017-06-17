import React from 'react';
import PropTypes from 'prop-types';

const Static = props => <h1>{props.txt}</h1>;
Static.propTypes = {
  txt: PropTypes.string,
};
export default Static;
