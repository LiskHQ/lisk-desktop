import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError) {
      return <p className='error-header'>{this.props.errorMessage}</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
