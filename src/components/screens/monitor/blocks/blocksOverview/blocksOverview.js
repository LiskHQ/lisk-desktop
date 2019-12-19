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
        name: t('Last {{num}} blocks', { num: 10 }),
      },
      {
        value: 50,
        name: t('Last {{num}} blocks', { num: 50 }),
      },
      {
        value: 100,
        name: t('Last {{num}} blocks', { num: 100 }),
      },
    ];


    return (
      <Box className={styles.wrapper}>
        <BoxHeader className="box-header">
          <h2>{t('Overview')}</h2>
          <BoxTabs
            tabs={tabs}
            active={activeTab}
            onClick={this.changeTab}
            className="box-tabs"
          />
        </BoxHeader>
        <BoxContent>
          <div className={`${grid.row} ${styles.row}`}>

            <div className={`${grid['col-sm-8']} ${grid['col-xs-7']} ${styles.chartBox}`}>
              <h2 className={styles.chartTitle}>{t('Transactions per block')}</h2>
              <div className={styles.chart}>
                <Chart
                  type={typeBar}
                  data={{
                    labels: blocks.data.map(block => block.id),
                    datasets: [{
                      label: t('block'),
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
                        gridLines: {
                          display: true,
                          offsetGridLines: true,
                          lineWidth: 0,
                        },
                        ticks: {
                          display: false,
                          gridLines: {
                            drawTicks: false,
                          },
                        },
                        scaleLabel: {
                          display: true,
                          labelString: t('Last {{num}} blocks', { num: activeTab }),
                          lineHeight: 2,
                          fontSize: chartStyles.fontSize,
                        },
                      }],
                      yAxes: [{
                        gridLines: {
                          display: true,
                          offsetGridLines: false,
                          lineWidth: 0,
                          zeroLineWidth: 1,
                          drawTicks: false,
                        },
                        ticks: {
                          padding: 15,
                          fontSize: chartStyles.fontSize,
                        },
                      }],
                    },
                    tooltips: {
                      callbacks: {
                        // istanbul ignore next
                        title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                        // istanbul ignore next
                        label(tooltipItem, data) {
                          return t('{{transactions}} transactions', { transactions: data.datasets[0].data[tooltipItem.index] });
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className={`${grid['col-sm-4']} ${grid['col-xs-5']} ${styles.chartBox}`}>
              <h2 className={styles.chartTitle}>{t('Empty/Not empty')}</h2>
              <div className={styles.chart}>
                <Chart
                  type={typeDoughnut}
                  data={{
                    labels: [t('Empty'), t('Not Empty')],
                    datasets: [{
                      backgroundColor: [chartStyles.mystic, chartStyles.ultramarineBlue],
                      data: blocks.data.reduce((acc, block) => {
                        if (block.numberOfTransactions) acc[1]++;
                        else acc[0]++;
                        return acc;
                      }, [0, 0]),
                    }],
                  }}
                  options={{
                    cutoutPercentage: 65,
                    tooltips: {
                      callbacks: {
                        // istanbul ignore next
                        title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                        // istanbul ignore next
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
