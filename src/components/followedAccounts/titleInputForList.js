import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import styles from './followedAccounts.css';
import { followedAccountUpdated } from '../../actions/followedAccounts';
import TitleInput from './accountTitleInput';

class TitleInputForList extends React.Component {
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

  handleChange(value, validateInput) {
    this.setState({
      title: {
        value,
        error: validateInput(value),
      },
    });
  }

  render() {
    return <TitleInput
      className={styles.title}
      title={this.state.title}
      disabled={!this.props.edit}
      hideLabel={true}
      onChange={this.handleChange.bind(this)}
    />;
  }
}

const mapDispatchToProps = dispatch => ({
  updateAccount: data => dispatch(followedAccountUpdated(data)),
});

export default connect(null, mapDispatchToProps)(translate()(TitleInputForList));
