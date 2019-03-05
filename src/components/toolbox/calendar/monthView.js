import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.generateDays = this.generateDays.bind(this);
  }

  previousMonth() {
    if (validations.canGoToPrevious(this.props.showingDate, this.props.minDate, this.options)) {
      const showingDate = moment(this.props.showingDate, this.props.dateFormat).subtract(1, 'month');
      this.props.setShowingDate(showingDate);
    }
  }

  nextMonth() {
    if (validations.canGoToNext(this.props.showingDate, this.props.maxDate, this.options)) {
      const showingDate = moment(this.props.showingDate, this.props.dateFormat).add(1, 'month');
      this.props.setShowingDate(showingDate);
    }
  }

  showYearView() {
    this.props.setCurrentView('year');
  }

  handleSelectDate({ target }) {
    this.props.onDateSelected(target.value);
  }

  generateDays(_, d) {
    const { dateFormat, minDate, maxDate } = this.props;
    const options = { ...this.options, amount: 'day' };
    const selectedDate = moment(this.props.selectedDate, dateFormat);
    const day = moment(this.props.showingDate, dateFormat).date(d + 1);
    const selected = selectedDate.isValid()
      && day.format(dateFormat) === selectedDate.format(dateFormat);
    const isDisabled = validations.shouldBeDisabled(day, minDate, maxDate, options);

    return <button key={`button-${day.format(dateFormat)}`}
      onClick={this.handleSelectDate}
      value={day.format(dateFormat)}
      disabled={isDisabled}
      className={`${styles.item} ${styles.dayItem} ${selected ? styles.selected : ''}`}>
        {day.format('D')}
      </button>;
  }

  render() {
    const { locale, dateFormat, isShown } = this.props;
    moment.locale(locale);
    const showingDate = moment(this.props.showingDate, dateFormat).startOf('month');
    const daysInMonth = [...Array(showingDate.daysInMonth())];

    return (
      <div className={`${!isShown ? styles.hidden : ''} monthView`}>
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
            {generateDayPlaceholder(
              showingDate.weekday(),
              moment(showingDate).subtract(showingDate.weekday(), 'days'),
              `${styles.item} ${styles.dayItem}`,
            )}

            {daysInMonth.map(this.generateDays)}

            {generateDayPlaceholder(
              6 - moment(showingDate).endOf('month').weekday(),
              moment(showingDate).add(1, 'days'),
              `${styles.item} ${styles.dayItem}`,
            )}
          </div>
        </div>
      </div>
    );
  }
}

MonthView.propTypes = {
  isShown: PropTypes.bool.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  onDateSelected: PropTypes.func.isRequired,
  setShowingDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  locale: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  showingDate: PropTypes.oneOfType([
    PropTypes.instanceOf(moment).isRequired,
    PropTypes.string,
  ]).isRequired,
};

/* istanbul ignore next */
MonthView.defaultProps = {
  isShown: false,
  setCurrentView: () => null,
  onDateSelected: () => null,
  setShowingDate: () => null,
  selectedDate: moment().format('DD.MM.YY'),
  dateFormat: 'DD.MM.YY',
  minDate: '',
  maxDate: '',
  locale: 'en',
  showingDate: moment(),
};

export default MonthView;
