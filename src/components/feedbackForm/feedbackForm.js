import React, { Component } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './feedbackForm.css';
import Questionare from './questionare';

class FeedbackForm extends Component {
  onCancel() {
    this.props.hideDialog();
  }

  onSubmit(feedbackState) {
    // TODO: integrate with api
    this.props.sendFeedback(feedbackState);
    this.props.hideDialog();
  }

  render() {
    return (
      <section className={`${grid.row} ${grid['between-xs']} ${styles.feedbackForm}`}>
        <Questionare {...this.props}
          onCancel={this.onCancel.bind(this)}
          onSubmit={this.onSubmit.bind(this)}/>
      </section>
    );
  }
}

export default FeedbackForm;
