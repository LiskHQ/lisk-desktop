import React from 'react';
import TextareaV2 from './textareaV2';

class AutoresizeTextarea extends React.Component {
  constructor() {
    super();

    this.setRef = this.setRef.bind(this);
  }

  setRef(node) {
    this.textRef = node;
  }

  componentDidMount() {
    const { scrollHeight } = this.textRef;
    this.height = parseInt(scrollHeight, 10);
  }

  componentDidUpdate() {
    const { clientHeight, scrollHeight } = this.textRef;
    this.textRef.style.height = `${this.height}px`;
    if (clientHeight < scrollHeight && scrollHeight > this.height) {
      this.textRef.style.height = `${scrollHeight}px`;
    }
  }

  render() {
    const { value, ...props } = this.props;
    return <TextareaV2
      setRef={this.setRef}
      value={value}
      {...props} />;
  }
}

export default AutoresizeTextarea;
