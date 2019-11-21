import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../../toolbox/box';
import BoxHeader from '../../../../toolbox/box/header';
import BoxContent from '../../../../toolbox/box/content';
import BoxTabs from '../../../../toolbox/tabs';
import Chart from '../../../../toolbox/charts';
import styles from './blocksOverview.css';
import { chartStyles } from '../../../../../constants/chartConstants';

class BlocksOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 10,
    };

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab({ value }) {
    this.setState({ activeTab: value });
    this.props.blocks.loadData({ limit: value.toString() });
  }

  render() {
    const { t, blocks } = this.props;
    const barChartData = {
      labels: new Array(this.state.activeTab),
      datasets: [{
        label: 'block data',
        data: blocks.data.map(block => block.numberOfTransactions),
        backgroundColor: chartStyles.ultramarineBlue,
      }],
    };

    const options = {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Last blocks',
          },
        }],
      },
    };

    const doughnutChartData = {
      labels: ['Empty', 'Not Empty'],
      datasets: [{
        backgroundColor: [chartStyles.mystic, chartStyles.ultramarineBlue],
        data: blocks.data.reduce((acc, item) => {
          if (item.numberOfTransactions) acc[1]++;
          else acc[0]++;
          return acc;
        }, [0, 0]),
      }],
    };

    const douthnutChartOptions = {
      cutoutPercentage: 70,
    };

    const tabs = {
      tabs: [
        {
          value: 10,
          name: ('Last 10 Blocks'),
        },
        {
          value: 50,
          name: ('Last 50 Blocks'),
        },
        {
          value: 100,
          name: ('Last 100 Blocks'),
        },
      ],
      active: this.state.activeTab,
      onClick: this.changeTab,
    };

    return (
      <Box>
        <BoxHeader>
          <h2>{t('Overview')}</h2>
          <BoxTabs {...tabs} />
        </BoxHeader>
        <BoxContent>
          <div className={`${grid.row} ${styles.box}`}>
            <div className={`${grid['col-sm-8']} ${styles.cell}`}>
              <h2 className={styles.cellHeader}>{t('Transactions per block')}</h2>
              <Chart
                type="bar"
                options={options}
                data={barChartData}
              />
            </div>
            <div className={`${grid['col-sm-4']} ${styles.cell}`}>
              <h2 className={styles.cellHeader}>{t('Empty/Not empty')}</h2>
              <Chart
                type="doughnut"
                data={doughnutChartData}
                options={douthnutChartOptions}
              />
            </div>
          </div>
        </BoxContent>
      </Box>
    );
  }
}

export default BlocksOverview;
