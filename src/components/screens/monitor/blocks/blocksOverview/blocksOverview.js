import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../../toolbox/box';
import BoxHeader from '../../../../toolbox/box/header';
import BoxContent from '../../../../toolbox/box/content';
import BoxTabs from '../../../../toolbox/tabs';
import Chart from '../../../../toolbox/charts';
import styles from './blocksOverview.css';
import { chartStyles, typeBar, typeDoughnut } from '../../../../../constants/chartConstants';

class BlocksOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 10,
    };
  }

  changeTab = ({ value }) => {
    this.setState({ activeTab: value });
    this.props.blocks.loadData({ limit: value.toString() });
  }

  render() {
    const { activeTab } = this.state;
    const { t, blocks } = this.props;

    const tabs = [
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
    ];


    return (
      <Box>
        <BoxHeader className="box-header">
          <h2>{t('Overview')}</h2>
          <BoxTabs tabs={tabs} active={activeTab} onClick={this.changeTab} />
        </BoxHeader>
        <BoxContent>
          <div className={`${grid.row} ${styles.row}`}>

            <div className={`${grid['col-sm-8']} ${styles.chartBox}`}>
              <h2 className={styles.chartTitle}>{t('Transactions per block')}</h2>
              <div className={styles.chart}>
                <Chart
                  type={typeBar}
                  data={{
                    labels: blocks.data.map(block => block.id),
                    datasets: [{
                      label: 'block',
                      data: blocks.data.map(block => block.numberOfTransactions),
                      backgroundColor: chartStyles.ultramarineBlue,
                    }],
                  }}
                  options={{
                    legend: {
                      display: false,
                    },
                    layout: {
                      padding: {
                        left: 0,
                        right: 0,
                        bottom: 0,
                      },
                    },
                    scales: {
                      xAxes: [{
                        ticks: {
                          display: false,
                        },
                        scaleLabel: {
                          display: true,
                          labelString: `Last ${activeTab} blocks`,
                          lineHeight: 2,
                          fontSize: chartStyles.fontSize,
                        },
                      }],
                      yAxes: [{
                        ticks: {
                          padding: 15,
                          fontSize: chartStyles.fontSize,
                        },
                      }],
                    },
                    tooltips: {
                      callbacks: {
                        title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                        label(tooltipItem, data) {
                          return t('{{ transactions }} Transacitons', { transactions: data.datasets[0].data[tooltipItem.index] });
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className={`${grid['col-sm-4']} ${styles.chartBox}`}>
              <h2 className={styles.chartTitle}>{t('Empty/Not empty')}</h2>
              <div className={styles.chart}>
                <Chart
                  type={typeDoughnut}
                  data={{
                    labels: ['Empty', 'Not Empty'],
                    datasets: [{
                      backgroundColor: [chartStyles.mystic, chartStyles.ultramarineBlue],
                      data: blocks.data.reduce((acc, item) => {
                        if (item.numberOfTransactions) acc[1]++;
                        else acc[0]++;
                        return acc;
                      }, [0, 0]),
                    }],
                  }}
                  options={{
                    tooltips: {
                      callbacks: {
                        title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                        label(tooltipItem, data) {
                          return t('{{ blocks }} Blocks', { blocks: data.datasets[0].data[tooltipItem.index] });
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

          </div>
        </BoxContent>
      </Box>
    );
  }
}

export default BlocksOverview;
