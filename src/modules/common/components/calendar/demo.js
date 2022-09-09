import React from 'react';
import moment from 'moment';
import { firstBlockTime } from '@block/utils/firstBlockTime';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import Calendar from './calendar';

/* eslint-disable-next-line no-console */
const onDateSelected = console.log;

const dateFormat = 'DD.MM.YY';
const CalendarDemo = () => (
  <div>
    <h2>Calendar</h2>
    <DemoRenderer>
      <Calendar
        onDateSelected={onDateSelected}
        dateFormat={dateFormat}
        minDate={moment(firstBlockTime).format(dateFormat)}
        maxDate={moment().format(dateFormat)}
        date={moment().format(dateFormat)}
      />
    </DemoRenderer>
  </div>
);

export default CalendarDemo;
