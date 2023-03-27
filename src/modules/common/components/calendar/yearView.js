import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Icon from 'src/theme/Icon';
import { validations } from './calendarUtils';
import styles from './calendar.css';

class YearView extends Component {
  constructor(props) {
    super();

    this.options = {
      dateFormat: props.dateFormat,
      locale: props.locale,
      amount: 'year',
    };

    this.nextYear = this.nextYear.bind(this);
    this.previousYear = this.previousYear.bind(this);
    this.selectMonth = this.selectMonth.bind(this);
    this.generateMonths = this.generateMonths.bind(this);
  }

  previousYear() {
    if (validations.canGoToPrevious(this.props.showingDate, this.props.minDate, this.options)) {
      const showingDate = moment(this.props.showingDate).subtract(1, 'year');
      this.props.setShowingDate(showingDate);
    }
  }

  nextYear() {
    if (validations.canGoToNext(this.props.showingDate, this.props.maxDate, this.options)) {
      const showingDate = moment(this.props.showingDate, this.props.dateFormat).add(1, 'year');
      this.props.setShowingDate(showingDate);
    }
  }

  selectMonth({ target }) {
    const showingDate = moment(this.props.showingDate).month(target.value);
    this.props.setCurrentView('month');
    this.props.setShowingDate(showingDate);
  }

  generateMonths(month) {
    const { dateFormat, minDate, maxDate } = this.props;
    const selectedDate = moment(this.props.selectedDate, dateFormat);
    const showingDate = moment(this.props.showingDate, dateFormat);
    const options = { ...this.options, amount: 'month' };
    const day = moment(showingDate).month(month);
    const selected =
      selectedDate.isValid() && day.format('MM.YYYY') === selectedDate.format('MM.YYYY');
    const isDisabled = validations.shouldBeDisabled(day, minDate, maxDate, options);

    return (
      <button
        key={`button-${day.format('MM.YYYY')}`}
        disabled={isDisabled}
        value={month}
        onClick={this.selectMonth}
        className={`${styles.item} ${styles.monthItem} ${selected ? styles.selected : ''}`}
        type="button"
      >
        {month}
      </button>
    );
  }

  render() {
    const { locale, dateFormat, isShown, minDate, maxDate } = this.props;
    moment.locale(locale);
    const showingDate = moment(this.props.showingDate, dateFormat);
    const prevIcon = validations.canGoToPrevious(showingDate, minDate, this.options)
      ? 'arrowLeftActive'
      : 'arrowLeftInactive';
    const nextIcon = validations.canGoToNext(showingDate, maxDate, this.options)
      ? 'arrowRightActive'
      : 'arrowRightInactive';

    return (
      <div className={`${!isShown ? styles.hidden : ''} yearView`}>
        <header className={styles.calendarHeader}>
          <span className={styles.navigationButton} onClick={this.previousYear}>
            <Icon name={prevIcon} />
          </span>
          <span className={styles.viewName}>{showingDate.format('YYYY')}</span>
          <span className={styles.navigationButton} onClick={this.nextYear}>
            <Icon name={nextIcon} />
          </span>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.itemsContent}>
            {moment.monthsShort(true).map(this.generateMonths)}
          </div>
        </div>
      </div>
    );
  }
}

YearView.propTypes = {
  isShown: PropTypes.bool.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  setShowingDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  locale: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  showingDate: PropTypes.instanceOf(moment).isRequired,
};

/* istanbul ignore next */
YearView.defaultProps = {
  isShown: false,
  setCurrentView: () => null,
  setShowingDate: () => null,
  selectedDate: moment().format('DD.MM.YY'),
  dateFormat: 'DD.MM.YY',
  minDate: '',
  maxDate: '',
  locale: 'en',
  showingDate: moment(),
};

export default YearView;
