import React, { Fragment } from 'react';
import styles from './create.css';
import { FontIcon } from './../../fontIcon';
import { PrimaryButton, Button } from '../../toolbox/buttons/button';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import AccountVisual from '../../accountVisual';
import Shapes from './shapes';

class CreateFirst extends React.Component {
  constructor() {
    super();
    this.state = { showHint: false };
  }

  componentDidMount() {
    this.props.addEventListener();
  }

  showHint() {
    this.setState({ showHint: !this.state.showHint });
  }

  render() {
    const {
      t, percentage, address, hintTitle, step, nextStep, passphrase,
    } = this.props;
    const modifyID = (id) => {
      const substring = id.slice(3, id.length - 1);
      const replacement = substring.replace(/.{1}/g, '*');
      return id.replace(substring, replacement);
    };

    return (
      <div className={styles.container}>
        <Shapes percentage={percentage} addressCreated={address}/>
        <header>
          <TransitionWrapper current={step} step='generate'>
            <h2 className={`${styles.generatorHeader}`}
              id="generatorHeader" >
              {t('Create your Lisk ID')}
              <br/>
              {hintTitle}
            </h2>
          </TransitionWrapper>
          <TransitionWrapper current={step} step='info'>
            <h2 className={`${styles.secondHeading}`}>
              {t('This is your Lisk ID')}
              <small onClick={this.showHint.bind(this)} className={this.state.showHint ? styles.hidden : ''}>
                <FontIcon value='info'></FontIcon>
                {t('What is Lisk ID?')}
              </small>
            </h2>
          </TransitionWrapper>
          <aside className={`${styles.description} ${step === 'info' && this.state.showHint ? styles.fadeIn : ''}`}>
            <p>The <b>Avatar</b> represents the ID making it easy to recognize.
              Every Lisk ID has one unique avatar.</p>
            <p>The <b>ID</b> is unique and can’t be changed.
              It’s yours.You will get the full <b>ID</b> at the end.</p>
            <Button
              label={t('Got it')}
              onClick={this.showHint.bind(this)}
              type={'button'} />
          </aside>
        </header>
        {address ?
          <Fragment>
            <figure>
              <AccountVisual address={address} size={150} />
            </figure>
            <h4 className={styles.address}>{modifyID(address)}</h4>
            <PrimaryButton
              theme={styles}
              label={t('Get passphrase')}
              className="get-passphrase-button"
              onClick={() => nextStep({
                passphrase,
                header: t('Your passphrase is used to access your Lisk ID.'),
                message: t('I am responsible for keeping my passphrase safe. No one can reset it, not even Lisk.'),
              })}
            />
          </Fragment>
          : ''}
      </div>
    );
  }
}

export default CreateFirst;
