import React from 'react';
import breakpoints from '../constants/breakpoints';

const withResizeValues = WrapperComponent => (
  // eslint-disable-next-line react/display-name
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isMediumViewPort: window.innerWidth <= breakpoints.m,
      };

      this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize() {
      this.setState({ isMediumViewPort: window.innerWidth <= breakpoints.m });
    }

    render() {
      return <WrapperComponent isMediumViewPort={this.state.isMediumViewPort} {...this.props} />;
    }
  }
);

export default withResizeValues;
