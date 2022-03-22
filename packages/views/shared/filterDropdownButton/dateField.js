import React from 'react';
import moment from 'moment';
import { firstBlockTime } from '@constants';
import { Input } from '@views/basics/inputs';
import Calendar from '@views/basics/calendar/calendar';
import Dropdown from '@views/basics/dropdown/dropdown';
import OutsideClickHandler from '@views/basics/outsideClickHandler';
import i18n from '../../../i18n';
import styles from './filters.css';

class DateField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shownDropdown: false,
      everShownDropdown: false,
    };

    this.hideDropdown = this.toggleDropdown.bind(this, false);
    this.showDropdown = this.toggleDropdown.bind(this, true);
    this.dateSelected = this.dateSelected.bind(this);
  }

  toggleDropdown(shownDropdown) {
    this.setState({ shownDropdown, everShownDropdown: true });
  }

  dateSelected(date) {
    const { name } = this.props;
    this.props.onChange({
      target: {
        name,
        value: date,
      },
    });
    this.hideDropdown();
  }

  render() {
    const {
      name, setInputRefs, onChange, filters, dateFormat, fields, showRightDropdown,
    } = this.props;
    const { shownDropdown, everShownDropdown } = this.state;

    return (
      <OutsideClickHandler
        className={styles.dropdownWrapper}
        disabled={!shownDropdown}
        onOutsideClick={this.hideDropdown}
      >
        <label className={styles.fieldHolder}>
          <Input
            setRef={setInputRefs}
            autoComplete="off"
            onChange={onChange}
            name={name}
            value={filters[name]}
            placeholder={dateFormat}
            onFocus={this.showDropdown}
            onClick={this.showDropdown}
            onKeyDown={this.handleKey}
            className={`${styles.input} ${name}Input`}
            isLoading={fields[name].loading}
            status={fields[name].error ? 'error' : 'ok'}
            size="m"
          />
        </label>
        <Dropdown
          className={`${showRightDropdown ? 'showRight' : 'showLeft'} ${styles.calendarDropdown}`}
          showDropdown={shownDropdown}
        >
          { everShownDropdown
            ? (
              <Calendar
                locale={i18n.language}
                onDateSelected={this.dateSelected}
                dateFormat={dateFormat}
                minDate={moment(firstBlockTime).format(dateFormat)}
                date={filters[name]}
              />
            ) : <span />}
        </Dropdown>
      </OutsideClickHandler>
    );
  }
}

export default DateField;
