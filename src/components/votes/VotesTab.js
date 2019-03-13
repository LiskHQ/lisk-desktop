import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import VotesTableHeader from './VotesTableHeader';
import styles from './votesTab.css';

class VotesTab extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  render() {
    const { t } = this.props;
    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
        <h1>{t('Voted delegates')}</h1>
        </header>
        <main>
          <VotesTableHeader />
        </main>
      </BoxV2>
    );
  }
}

export default translate()(VotesTab);
