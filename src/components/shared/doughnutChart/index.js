import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import styles from './doughnutChart.css';

class DoughnutChart extends React.Component {
  render() {
    const legend = {
      display: true,
      position: 'left',
      onClick: () => undefined,
      labels: {
        padding: 16,
        fontSize: 13,
        boxWidth: 8,
        usePointStyle: true,
      },
    };

    const data = {
      ...this.props.data,
      datasets: [
        {
          ...this.props.data.datasets[0],
          borderWidth: 0,
        }],
    };

    const options = {
      cutoutPercentage: 65,
    };

    return (
      <div className={styles.wrapper}>
        <Doughnut
          {...this.props}
          ref={(e) => { this.doughnutRef = e; }}
          legend={legend}
          data={data}
          options={options}
        />
      </div>
    );
  }
}

export default DoughnutChart;
