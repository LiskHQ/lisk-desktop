import React from 'react';
import styles from './dialog.css';

class DialogHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      dialog: null,
    };

    DialogHolder.singletonRef = this;
    DialogHolder.hideDialog = DialogHolder.hideDialog.bind(DialogHolder);
    DialogHolder.showDialog = DialogHolder.showDialog.bind(DialogHolder);
  }

  static hideDialog() {
    this.singletonRef.setState({ dialog: null });
    document.body.style.overflow = '';
  }

  static showDialog(dialog) {
    if (React.isValidElement(dialog)) {
      document.body.style.overflow = 'hidden';
      this.singletonRef.setState({ dialog });
      return true;
    }
    return false;
  }

  render() {
    const ChildComponent = this.state.dialog;
    return React.isValidElement(ChildComponent) && (
      <div className={styles.mask}>
        <ChildComponent.type {...ChildComponent.props} />
      </div>
    );
  }
}

DialogHolder.displayName = 'DialogHolder';

export default DialogHolder;
