import React from 'react';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import TableHeader from './TableHeader';

class VotesTab extends React.Component {
  constructor() {
    super();

    this.state = {

    };
  }

  render() {
    const { t } = this.props;
    return (
      <BoxV2>
        <header>
        <h1>{t('Voted delegates')}</h1>
        </header>
        <main>
          <TableHeader />
        </main>
      </BoxV2>
    );
  }
}

export default translate()(VotesTab);
