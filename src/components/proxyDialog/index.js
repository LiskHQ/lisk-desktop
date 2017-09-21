import { Input, Button } from 'react-toolbox';
import React from 'react';


class ProxyDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      password: {
        value: localStorage.proxyPassword || '',
      },
      username: {
        value: localStorage.proxyUsername || '',
      },
    };
  }

  handleChange(name, value) {
    this.setState({
      [name]: {
        value,
        error: value === '' ? 'Required' : '',
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem('proxyUsername', this.state.username.value);
    localStorage.setItem('proxyPassword', this.state.password.value);
    this.props.callback(this.state.username.value, this.state.password.value);
    this.props.closeDialog();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <p>
          To connect to Lisk network, you need to enter a username and password for proxy
          <b> {this.props.authInfo.host} </b>
        </p>
        <Input label='Username' required
          className='username'
          onChange={this.handleChange.bind(this, 'username')}
          error={this.state.username.error}
          value={this.state.username.value}/>
        <Input label='Password' required type='password'
          className='password'
          onChange={this.handleChange.bind(this, 'password')}
          error={this.state.password.error}
          value={this.state.password.value}/>
        <Button primary raised
          style={{ float: 'right' }}
          disabled = {this.state.password.value === '' || this.state.username.value === ''}
          label='Submit' type='submit' />
      </form>);
  }
}
export default ProxyDialog;
