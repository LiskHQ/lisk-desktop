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
    this.height = parseInt(this.textRef.scrollHeight, 10);
    this.textRef.style.height = `${this.height}px`;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.textRef.style.height = `${this.height}px`;
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { offsetHeight, scrollHeight } = this.textRef;
    this.textRef.style.height = `${this.height}px`;
    /* istanbul ignore next */
    if (offsetHeight < scrollHeight && scrollHeight > this.height) {
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
