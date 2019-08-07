import React from 'react';

class FlashMessageHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      children: {},
    };

    this.deleteMessage = this.deleteMessage.bind(this);

    FlashMessageHolder.singletonRef = this;
  }

  deleteMessage(name) {
    const prevChildren = this.state.children;
    const keys = Object.keys(prevChildren).filter(key => key !== name);
    const children = keys.reduce((acc, key) => ({ ...acc, [key]: prevChildren[key] }), {});
    this.setState({ children });
  }

  static addMessage(message, name) {
    const { children } = this.singletonRef.state;
    if (React.isValidElement(message) && name) {
      this.singletonRef.setState({
        children: {
          ...children,
          [name]: message,
        },
      });
      return true;
    }
    return false;
  }

  render() {
    const { children } = this.state;
    return Object.keys(children).map((key) => {
      const ChildComponent = children[key];
      return (
        <ChildComponent.type
          {...ChildComponent.props}
          onDismiss={() => this.deleteMessage(key)}
          key={key}
        />
      );
    });
  }
}

FlashMessageHolder.displayName = 'FlashMessageHolder';

export default FlashMessageHolder;
