import React from 'react';
import styles from './dialog.css';
import { appendSearchParams } from '../../../utils/searchParams';

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
    const { history } = this.singletonRef.props;
    // const searchParams = parseSearchParams(history.location.search);
    // if (searchParams.modal) {
    const newLocation = history.location.search.replace(/[?|&]modal=\w+/, '');
    history.push(newLocation);
    // }
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

  static showDialog(dialog, name) {
    if (React.isValidElement(dialog)) {
      const setDialog = () => this.singletonRef.setState({
        dismissed: false,
        dialog,
      });

      const { history } = this.singletonRef.props;

      // const newLocation = appendSearchParams(history.location.search, 'modal', name);
      // console.log(name, newLocation);
      // history.push(newLocation);

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
