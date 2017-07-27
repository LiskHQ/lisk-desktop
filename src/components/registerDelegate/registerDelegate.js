import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';
import InfoParagraph from '../infoParagraph';
import registerDelegate from '../../utils/api/delegate';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      title: 'register as delegate',
      name: {
        error: '',
        name: '',
      },
    };
  }

  register(username) {
    console.log(name);
    const secondSecret = this.props.account.secondSecret ? this.props.account.secondSecret : null;
    registerDelegate(this.props.peers.data, username, this.props.account.passphrase, secondSecret)
    .then((res) => {
      console.log('res', res);
    });
  }

  render() {
    return (
      <div>
        <Input label='Delegate name' required={true}
          autoFocus={true}
          error={this.state.name.error}
          value={this.state.name.value} />
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
            disabled={!this.state.name.value}
            onClick={this.register.bind(this)}/>
        </section>
      </div>
    );
  }
}

export default RegisterDelegate;
