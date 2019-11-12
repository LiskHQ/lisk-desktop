import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import styles from './chart.css';

class Charts extends React.Component {
  setChartCanvasRef = (node) => {
    this.chartCanvasRef = node;
  }

  componentDidMount() {
    // istanbul ignore else
    if (this.chartCanvasRef) this.generateChart();
  }

  generateChart = () => {
    const {
      type, data, options,
    } = this.props;

    const ctx = this.chartCanvasRef.getContext('2d');
    // eslint-disable-next-line no-new
    new Chart(ctx, {
      type,
      data,
      options,
    });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <canvas
          id="chart"
          ref={node => this.setChartCanvasRef(node)}
        />
      </div>
    );
  }
}

Charts.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

Charts.defaultProps = {
  type: 'line',
};

export default Charts;
