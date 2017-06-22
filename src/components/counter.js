/**
* this is a simple example of using Redux in a React application
*/

import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
* @description this is a reducer for handling counter state
* @param {number} state - current state of our component
* @param {object} action - it contains actions that we dispatched
* @returns {number} next state of our component
*/
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      state = 0;
      return state;
    default:
      return state;
  }
};

/**
* @description this is counter component definition
* @param {object} props - this is an object that contains all necessary props for this component
*/
const Counter = props => (
  <div>
    <h3>{props.value}</h3>
    <button onClick={props.increase}>+</button>
    <button onClick={props.decrease}>-</button>
    <button onClick={props.reset}>reset</button>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number,
  increase: PropTypes.func,
  decrease: PropTypes.func,
  reset: PropTypes.func,
};

const ReduxCounter = () => (
  <Provider store={createStore(counterReducer)}>
    <ConnectedCounter />
  </Provider>
);

/**
* @description map store dispatch to componect props
* @param {function} dispatcher function of the store
* @returns {object} object of actions that will pass to counter component as params
*/
const mapDispatchToProps = dispatch => ({
  increase: () => {
    dispatch({
      type: 'INCREMENT',
    });
  },
  decrease: () => {
    dispatch({
      type: 'DECREMENT',
    });
  },
  reset: () => {
    dispatch({
      type: 'RESET',
    });
  },
});

const mapStateToProps = state => ({ value: state });

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

export default ReduxCounter;
