import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import InfoParagraph from '../infoParagraph';
import { registerDelegate } from '../../utils/api/delegate';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      title: 'register as delegate',
      name: '',
      nameError: '',
    };
  }

  changeHandler(name, value) {
    this.setState({ [name]: value });
  }

  register(username, secondSecret) {
    registerDelegate(this.props.peers.data, username,
      this.props.account.passphrase, secondSecret)
      .then(() => {
        this.props.showSuccessAlert({
          text: `Delegate registration was successfully submitted with username: "${this.state.name}". It can take several seconds before it is processed.`,
        });
      })
      .catch((error) => {
        if (error && error.message === 'Username already exists') {
          this.setState({ nameError: error.message });
        } else {
          this.props.showErrorAlert({
            text: error && error.message ? `${error.message}.` : 'An error occurred while registering as delegate.',
          });
        }
      });
  }

  render() {
    // notify use about insufficient balance
    return (
      <div>
        <Input label='Delegate name' required={true}
          autoFocus={true}
          onChange={this.changeHandler.bind(this, 'name')}
          error={this.state.nameError}
          value={this.state.name} />
          {
             this.props.account.secondSecret &&
              <Input label='Second secret' required={true}
                value={this.state.secondSecret} />
          }
        <hr/>
        <InfoParagraph>
          Becoming a delegate requires registration. You may choose your own
          delegate name, which can be used to promote your delegate. Only the
          top 101 delegates are eligible to forge. All fees are shared equally
          between the top 101 delegates.
        </InfoParagraph>
        <section className={`${grid.row} ${grid['between-xs']}`}>
          <Button label='Cancel' className='cancel-button' onClick={this.props.closeDialog} />
          <Button label='Register'
            primary={true} raised={true}
            disabled={!this.state.name}
            onClick={this.register.bind(this, this.state.name, this.state.secondSecret)}/>
        </section>
      </div>
    );
  }
}

export default RegisterDelegate;
