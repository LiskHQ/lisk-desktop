import React from 'react';
import { translate } from 'react-i18next';
import Input from '../toolbox/inputs/input';
import { Button } from '../toolbox/buttons/button';
import styles from './index.css';

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
        error: value === '' ? this.props.t('Required') : '',
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
      <form className={styles.form} onSubmit={this.handleSubmit.bind(this)}>
        <p className={styles.text}>
          {this.props.text}
          <b> {this.props.authInfo.host} </b>
        </p>
        <Input label={this.props.t('Username')} required
          className='username'
          onChange={this.handleChange.bind(this, 'username')}
          error={this.state.username.error}
          value={this.state.username.value}/>
        <Input label={this.props.t('Password')} required type='password'
          className='password'
          onChange={this.handleChange.bind(this, 'password')}
          error={this.state.password.error}
          value={this.state.password.value}/>
        <div className={styles.submitButton}>
          <Button primary raised
            disabled = {this.state.password.value === '' || this.state.username.value === ''}
            label={this.props.t('Submit')} type='submit' />
        </div>
      </form>);
  }
}
export default translate()(ProxyDialog);

