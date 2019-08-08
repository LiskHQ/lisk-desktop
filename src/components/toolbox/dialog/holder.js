import React from 'react';
import styles from './dialog.css';

class DialogHolder extends React.Component {
  constructor() {
    super();
    this.state = {
      dialog: null,
      dismissed: false,
    };

    this.animationEnd = this.animationEnd.bind(this);

    DialogHolder.singletonRef = this;
    DialogHolder.hideDialog = DialogHolder.hideDialog.bind(DialogHolder);
    DialogHolder.showDialog = DialogHolder.showDialog.bind(DialogHolder);
  }

  static hideDialog() {
    this.singletonRef.setState({ dismissed: true });
    document.body.style.overflow = '';
  }

  animationEnd() {
    const { dismissed } = this.state;
    if (dismissed) {
      this.setState({
        dialog: null,
        dismissed: false,
      });
    }
  }

  static showDialog(dialog) {
    if (React.isValidElement(dialog)) {
      const setDialog = () => this.singletonRef.setState({
        dismissed: false,
        dialog,
      });

      document.body.style.overflow = 'hidden';
      this.singletonRef.setState({
        dismissed: true,
        dialog: null,
      }, setDialog);
      return true;
    }
    return false;
  }

  render() {
    const { dismissed } = this.state;
    const ChildComponent = this.state.dialog;
    return React.isValidElement(ChildComponent) && (
      <div
        className={`${styles.mask} ${dismissed ? styles.hide : styles.show}`}
        onAnimationEnd={this.animationEnd}
      >
        <ChildComponent.type
          {...ChildComponent.props}
        />
      </div>
    );
  }
}

DialogHolder.displayName = 'DialogHolder';

export default DialogHolder;
