import React from 'react';

class FlashMessageHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      children: {},
    };

    FlashMessageHolder.singletonRef = this;
  }

  static deleteMessage(name) {
    const prevChildren = this.singletonRef.state.children;
    const keys = Object.keys(prevChildren).filter(key => key === name);
    const children = keys.reduce((acc, key) => ({ ...acc, [key]: prevChildren[key] }), {});
    this.singletonRef.setState({ children });
  }

  static addMessage(message, name) {
    if (React.isValidElement(message) && name) {
      this.singletonRef.setState(({ children }) => ({
        children: {
          ...children,
          [name]: message,
        },
      }));
    }
  }

  render() {
    const { children } = this.state;
    return Object.keys(children).map(key =>
      React.cloneElement(children[key], { key }));
  }
}

FlashMessageHolder.displayName = 'FlashMessageHolder';

export default FlashMessageHolder;
