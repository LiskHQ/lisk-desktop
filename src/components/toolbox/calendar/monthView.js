import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import { validations, generateDayPlaceholder } from './calendarUtils';
import styles from './calendar.css';

class MonthView extends Component {
  constructor(props) {
    super();

    this.options = {
      dateFormat: props.dateFormat,
      locale: props.locale,
      amount: 'month',
    };

    this.nextMonth = this.nextMonth.bind(this);
    this.previousMonth = this.previousMonth.bind(this);
    this.showYearView = this.showYearView.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
  }

  previousMonth() {
    if (validations.canGoToPrevious(this.props.showingDate, this.props.minDate, this.options)) {
      const showingDate = moment(this.props.showingDate).subtract(1, 'month');
      this.props.setShowingDate(showingDate);
    }
  }

  nextMonth() {
    if (validations.canGoToNext(this.props.showingDate, this.props.maxDate, this.options)) {
      const showingDate = moment(this.props.showingDate).add(1, 'month');
      this.props.setShowingDate(showingDate);
    }
  }

  showYearView() {
    this.props.setCurrentView('year');
  }

  handleSelectDate({ target }) {
    this.props.onDateSelected(target.value);
  }

  render() {
    const { locale, dateFormat, isShown } = this.props;
    moment.locale(locale);
    const selectedDate = moment(this.props.selectedDate, dateFormat);
    const showingDate = moment(this.props.showingDate).startOf('month');
    const day = moment(showingDate);

    return (
      <div className={`${!isShown ? styles.hidden : ''}`}>
        <header className={styles.calendarHeader}>
          <span className={styles.navigationButton} onClick={this.previousMonth} />
          <span
            onClick={this.showYearView}
            className={`${styles.viewName} ${styles.clickable}`}>
            {showingDate.format('MMMM YYYY')}
          </span>
          <span className={styles.navigationButton} onClick={this.nextMonth} />
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.monthHeader}>
            {moment.weekdaysShort(true).map((weekday, key) =>
              <div className={styles.weekday} key={key}>{weekday}</div>)}
          </div>
          <div className={styles.itemsContent}>
            { generateDayPlaceholder(day.weekday(), moment(day).subtract(day.weekday(), 'days'), `${styles.item} ${styles.dayItem}`) }
            { [...Array(day.daysInMonth())].map((_, d) => {
              day.date(d + 1);
              const options = {
                ...this.options,
                amount: 'day',
              };
              const selected = selectedDate.isValid()
                && day.format(dateFormat) === selectedDate.format(dateFormat);
              const isDisabled = validations
                .shouldBeDisabled(day, this.props.minDate, this.props.maxDate, options);
              return <button key={d}
                onClick={this.handleSelectDate}
                value={day.format(dateFormat)}
                disabled={isDisabled}
                className={`${styles.item} ${styles.dayItem} ${selected ? styles.selected : ''}`}>
                  {day.format('D')}
                </button>;
            })}
            { generateDayPlaceholder(6 - day.weekday(), day.add(1, 'days'), `${styles.item} ${styles.dayItem}`) }
          </div>
        </div>
      </div>
    );
  }
}

// YearView.propTypes

export default MonthView;
