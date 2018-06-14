import actionTypes from '../../constants/actions';

const news = (state = {
  channels: {
    academy: false,
    twitter: false,
    blog: false,
    github: false,
    reddit: false,
  },
}, action) => {
  switch (action.type) {
    case actionTypes.switchChannel:
      return {
        channels: {
          ...state.channels,
          [action.data.name]: action.data.value,
        },
      };
    default:
      return state;
  }
};

export default news;
