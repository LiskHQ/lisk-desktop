import React from 'react';

class DialogOnHover extends React.Component {
  constructor() {
    super();
    this.state = {
      showDialog: false,
    };
  }

  handleMouseLeave = () => {
    this.setState({ showDialog: false });
  }

  handleMouseMove = () => {
    this.setState({ showDialog: true });
  }

  render() {
    const { children } = this.props;
    return (
      <div
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      >
        {children}
      </div>
    );
  }
}

export default DialogOnHover;
