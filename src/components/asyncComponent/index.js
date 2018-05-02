import React, { Component } from 'react';

const asyncComponent = importComponent =>
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();
      this.setState({
        component,
      });
    }

    render() {
      const Comp = this.state.component;
      return Comp ? <Comp {...this.props} /> : <div style={{ height: '75vh' }}/>;
    }
  };

export default asyncComponent;
