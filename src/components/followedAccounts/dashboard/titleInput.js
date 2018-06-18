import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import Input from '../../toolbox/inputs/input';
import styles from './followedAccounts.css';
import { followedAccountUpdated } from './../../../actions/followedAccounts';

class TitleInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: { value: props.account.title } };
  }

  componentWillReceiveProps(props) {
    const { value: newTitle, error } = this.state.title;
    const oldTitle = props.account.title;

    if (!props.edit && newTitle.length && oldTitle !== newTitle && !error) {
      this.props.updateAccount({
        ...props.account,
        title: this.state.title.value,
      });
    } else if (!props.edit && (!newTitle.length || error)) {
      this.setState({ title: { value: oldTitle } });
    }
  }

  handleChange(value) {
    this.setState({
      title: {
        value,
        error: this.validateInput(value),
      },
    });
  }

  validateInput(value) {
    return value.length > 20 ? this.props.t('Title too long') : undefined;
  }

  render() {
    return <Input
      className={`${styles.title} account-title`}
      error={this.state.title.error}
      value={this.state.title.value}
      disabled={!this.props.edit}
      autoFocus={true}
      onChange={val => this.handleChange(val)}
    />;
  }
}

const mapDispatchToProps = dispatch => ({
  updateAccount: data => dispatch(followedAccountUpdated(data)),
});

export default connect(null, mapDispatchToProps)(translate()(TitleInput));
