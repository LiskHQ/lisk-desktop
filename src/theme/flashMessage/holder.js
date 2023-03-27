import React from 'react';

class FlashMessageHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      children: {},
    };

    FlashMessageHolder.deleteMessage = FlashMessageHolder.deleteMessage.bind(FlashMessageHolder);

    FlashMessageHolder.singletonRef = this;
  }

  static deleteMessage(name) {
    const prevChildren = this.singletonRef.state.children;
    const keys = Object.keys(prevChildren).filter((key) => key !== name);
    const children = keys.reduce((acc, key) => ({ ...acc, [key]: prevChildren[key] }), {});
    this.singletonRef.setState({ children });
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
        // eslint-disable-next-line react/jsx-pascal-case
        <ChildComponent.type
          {...ChildComponent.props}
          onDismiss={() => FlashMessageHolder.deleteMessage(key)}
          key={key}
        />
      );
    });
  }
}

FlashMessageHolder.displayName = 'FlashMessageHolder';

export default FlashMessageHolder;
