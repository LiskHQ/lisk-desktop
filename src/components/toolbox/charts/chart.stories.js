import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Box from '../box';
import BoxHeader from '../box/header';
import Chart from './index';
import style from './chart.stories.css';

storiesOf('Toolbox', module)
  .add('Chart', () => (
    <StoryWrapper>
      <Box className={style.wrapper}>
        <BoxHeader><h1>Line Chart</h1></BoxHeader>
        <div className={style.container}>
          <Chart
            type="line"
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Oug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: '123456789L',
                  data: [35, 55, 23, 67, 98, 46, 134, 66, 70, 33, 100, 120],
                },
              ],
            }}
          />
        </div>
      </Box>

      <Box className={style.wrapper}>
        <BoxHeader><h1>Bar Chart</h1></BoxHeader>
        <div className={style.container}>
          <Chart
            type="bar"
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Oug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: '123456789L',
                  data: [35, 55, 23, 67, 98, 46, 134, 66, 70, 33, 100, 120],
                },
                {
                  label: '987654321L',
                  data: [10, 27, 30, 30, 80, 20, 100, 45, 138, 77, 88, 121],
                },
              ],
            }}
          />
        </div>
      </Box>

      <Box className={style.wrapper}>
        <BoxHeader><h1>Doughnut Chart</h1></BoxHeader>
        <div className={style.container}>
          <Chart
            type="doughnut"
            data={{
              labels: ['0 < 1', '1 < 100', '100 < 1K', '> 1K'],
              datasets: [
                {
                  label: 'ABC',
                  data: [100, 634, 329, 98],
                },
              ],
            }}
          />
        </div>
      </Box>

    </StoryWrapper>
  ));
