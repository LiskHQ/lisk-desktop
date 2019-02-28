import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import styles from './calendar.css';

class Calendar extends React.Component {
  constructor(props) {
    super();

    const locale = Array.isArray(props.locale) ? [...props.locale] : [props.locale];
    moment.locale([...locale, 'en']);

    const showingDate =
      (moment(props.date, props.dateFormat).isValid() && moment(props.date, props.dateFormat))
      || moment();
    this.state = {
      showingDate,
    };

    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  generatePlaceholder(count, day) {
    return [...Array(count)].map((x, d) => {
      const result = <button key={d} disabled={true} className={styles.day}>{day.format('DD')}</button>;
      day.add(1, 'days');
      return result;
    });
  }

  shouldComponentUpdate(nextProps) {
    const showingDate =
      (moment(nextProps.date, nextProps.dateFormat).isValid()
        && moment(nextProps.date, nextProps.dateFormat))
      || this.state.showingDate;

    if (showingDate.format(nextProps.dateFormat)
      !== this.state.showingDate.format(nextProps.dateFormat)) {
      this.setState({ showingDate });
      return false;
    }
    return true;
  }

  previousMonth() {
    const showingDate = this.state.showingDate.subtract(1, 'month');
    this.setState({
      showingDate,
    });
  }

  nextMonth() {
    const showingDate = this.state.showingDate.add(1, 'month');
    this.setState({
      showingDate,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleSelectDate({ target }) {
    console.log(target.value);
  }

  render() {
    const locale = Array.isArray(this.props.locale) ? [...this.props.locale] : [this.props.locale];
    moment.locale([...locale, 'en']);
    const { dateFormat } = this.props;
    const { showingDate } = this.state;
    const today = moment();
    const day = moment(showingDate).startOf('month');

    return (
      <section className={styles.calendarWrapper}>
        <header className={styles.calendarHeader}>
          <button onClick={this.previousMonth}>{'<<<<<'}</button>
          {showingDate.format('MMMM')}
          <button onClick={this.nextMonth}>{'>>>>>'}</button>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.monthHeader}>
            {moment.weekdaysMin(true).map((weekday, key) =>
              <div className={styles.weekday} key={key}>{weekday}</div>)}
          </div>
          <div className={styles.month}>
          { this.generatePlaceholder(day.weekday(), day.subtract(day.weekday(), 'days')) }
          { [...Array(day.daysInMonth())].map((x, d) => {
            const isToday = today.format(dateFormat) === day.date(d + 1).format(dateFormat);
            return <button key={d}
              onClick={this.handleSelectDate}
              value={day.date(d + 1).format(dateFormat)}
              className={`${isToday ? 'today' : ''} ${styles.day}`}>
                {day.format('DD')}
              </button>;
          })}
          { this.generatePlaceholder(6 - day.weekday(), day.add(1, 'days')) }
          </div>
        </div>
      </section>
    );
  }
}

Calendar.propTypes = {
  locale: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  date: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
};

Calendar.defaultProps = {
  locale: 'en',
  date: moment().format('DD.MM.YY'),
  dateFormat: 'DD.MM.YY',
};

export default Calendar;
