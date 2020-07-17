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
    this.backdropClick = this.backdropClick.bind(this);
    this.backdropRef = React.createRef();

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

  // eslint-disable-next-line class-methods-use-this
  backdropClick(e) {
    if (e.target === this.backdropRef.current) {
      DialogHolder.hideDialog();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.history.location !== prevProps.history.location) {
      DialogHolder.hideDialog();
    }
  }

  render() {
    const { dismissed, position } = this.state;
    const ChildComponent = this.state.dialog;
    return React.isValidElement(ChildComponent) && (
      <div
        className={`${styles.mask} ${dismissed ? styles.hide : styles.show}`}
        onAnimationEnd={this.animationEnd}
        onClick={this.backdropClick}
        ref={this.backdropRef}
      >
        <ChildComponent.type
          {...ChildComponent.props}
          position={position}
        />
      </div>
    );
  }
}

DialogHolder.displayName = 'DialogHolder';

export default DialogHolder;
