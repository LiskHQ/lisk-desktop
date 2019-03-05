import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import YearView from './yearView';
import MonthView from './monthView';
import styles from './calendar.css';

class Calendar extends React.Component {
  constructor(props) {
    super();

    const locale = Array.isArray(props.locale) ? [...props.locale, 'en'] : [props.locale, 'en'];
    moment.locale(locale);
    const showingDate =
      (moment(props.date, props.dateFormat).isValid() && moment(props.date, props.dateFormat))
      || moment();

    this.state = {
      showingDate,
      locale,
      currentView: 'month',
    };

    this.setShowingDate = this.setShowingDate.bind(this);
    this.setCurrentView = this.setCurrentView.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { dateFormat } = this.props;
    const prevDate = moment(this.props.date, dateFormat);
    const newDate = moment(nextProps.date, dateFormat);
    if (prevDate.isValid() && newDate.isValid()
      && newDate.format('MM.YYYY') !== prevDate.format('MM.YYYY')) {
      this.setState({ showingDate: newDate });
      return false;
    }
    return true;
  }

  setCurrentView(view) {
    this.setState({ currentView: view });
  }

  setShowingDate(date) {
    const showingDate = moment(date);
    if (showingDate.isValid()) {
      this.setState({ showingDate });
    }
  }

  render() {
    moment.locale(this.state.locale);
    const { currentView } = this.state;
    const { dateFormat } = this.props;

    return (
      <section className={styles.calendarWrapper}>
        <YearView
          isShown={currentView === 'year'}
          setCurrentView={this.setCurrentView}
          setShowingDate={this.setShowingDate}
          selectedDate={this.props.date}
          dateFormat={dateFormat}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          locale={this.state.locale}
          showingDate={this.state.showingDate} />
        <MonthView
          isShown={currentView === 'month'}
          setCurrentView={this.setCurrentView}
          onDateSelected={this.props.onDateSelected}
          setShowingDate={this.setShowingDate}
          selectedDate={this.props.date}
          dateFormat={dateFormat}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          locale={this.state.locale}
          showingDate={this.state.showingDate} />
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
  onDateSelected: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
};

/* istanbul ignore next */
Calendar.defaultProps = {
  locale: 'en',
  date: moment().format('DD.MM.YY'),
  dateFormat: 'DD.MM.YY',
  onDateSelected: () => null,
  minDate: '',
  maxDate: '',
};

export default Calendar;
