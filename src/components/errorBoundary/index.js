import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    // TODO: log the error to an error reporting service
  }

  render() {
    const renderFallback = (isDevelopment, errorMessage = '', info) => (
      <div>
        <h1 className='error-header'>{errorMessage}</h1>
        {isDevelopment ?
          <p className='error-body'>{`${info.componentStack}`}</p> : null
        }
      </div>
    );
    if (this.state.hasError) {
      return renderFallback(this.props.isDevelopment, this.props.errorMessage, this.state.info);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
