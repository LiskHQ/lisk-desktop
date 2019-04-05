import React from 'react';
import moment from 'moment';
import { translate } from 'react-i18next';
import { firstBlockTime } from '../../../constants/datetime';
import { getDateTimestampFromFirstBlock, formatInputToDate } from '../../../utils/datetime';
import { InputV2 } from '../../toolbox/inputsV2';
import { getInputSelection, setInputSelection } from '../../../utils/selection';
import styles from './filters.css';
import DropdownV2 from '../../toolbox/dropdownV2/dropdownV2';
import Calendar from '../../toolbox/calendar/calendar';
import Feedback from '../../toolbox/feedback/feedback';
import keyCodes from '../../../constants/keyCodes';
import SpinnerV2 from '../../spinnerV2/spinnerV2';
import svg from '../../../utils/svgIcons';

class DateFieldGroup extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super();

    this.state = {
      fields: {
        dateTo: {
          error: false,
          value: '',
          loading: false,
        },
        dateFrom: {
          error: false,
          value: '',
          loading: false,
        },
      },
      feedback: '',
      shownDropdown: '',
    };

    this.inputRefs = {
      dateTo: null,
      dateFrom: null,
    };

    this.dropdownRefs = {};
    this.timeout = null;

    this.dateFormat = props.t('DD.MM.YY');

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.setInputRefs = this.setInputRefs.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setDropownRefs = this.setDropownRefs.bind(this);
    this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.dateSelected = this.dateSelected.bind(this);
    this.generateField = this.generateField.bind(this);
  }

  /* instanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideDropdown);
    clearTimeout(this.timeout);
  }

  setInputRefs(node) {
    if (node && node.name) {
      this.inputRefs[node.name] = node;
    }
  }

  setDropownRefs(node) {
    const dropdownName = node && node.dataset && node.dataset.name;
    this.dropdownRefs = dropdownName ? {
      ...this.dropdownRefs,
      [dropdownName]: node,
    } : this.dropdownRefs;
  }

  handleFocus({ target }) {
    const dropdownName = `${target.name}Dropdown`;
    if (this.state.shownDropdown !== dropdownName) {
      this.toggleDropdown(dropdownName);
    }
  }

  toggleDropdown(dropdownName) {
    if (!(this.state.shownDropdown === dropdownName)) {
      document.addEventListener('click', this.handleClickOutsideDropdown);
    } else {
      document.removeEventListener('click', this.handleClickOutsideDropdown);
    }

    this.setState(prevState => ({
      shownDropdown: prevState.shownDropdown === dropdownName ? '' : dropdownName,
    }));
  }

  // istanbul ignore next
  handleClickOutsideDropdown(e) {
    const dropdownName = this.state.shownDropdown;
    const ref = this.dropdownRefs[dropdownName];
    if (ref && ref.contains(e.target)) return;
    this.toggleDropdown(dropdownName);
  }

  dateSelected(date, fieldName) {
    this.handleFieldChange({
      target: {
        name: fieldName,
        value: date,
      },
    });
  }

  validateDates(fieldsObj, selectionObj) {
    const { t } = this.props;
    let feedback = '';
    // eslint-disable-next-line max-statements
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      const date = moment(value, this.dateFormat);
      let error = false;

      if (value && !date.isValid()) {
        feedback = t(`Date must be in ${this.dateFormat} format`);
        error = true;
      } else if (
        (field === 'dateFrom' && date > moment(fieldsObj.dateTo.value, this.dateFormat))
        || (field === 'dateTo' && date < moment(fieldsObj.dateFrom.value, this.dateFormat))
      ) {
        feedback = t('Invalid Dates');
        error = true;
      }

      if (date.isValid() && getDateTimestampFromFirstBlock(value, this.dateFormat) < 0) {
        feedback = t('Date must be after {{firstBlock}}', {
          firstBlock: moment(firstBlockTime).format(this.dateFormat),
        });
        error = true;
      }

      return {
        ...acc,
        [field]: {
          value,
          error,
          loading: false,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields, feedback }, () => {
      setInputSelection(this.inputRefs[selectionObj.name], selectionObj.start, selectionObj.end);
    });
  }

  handleKey(evt) {
    const { keyCode, target } = evt;
    switch (keyCode) {
      case keyCodes.delete: {
        const selection = getInputSelection(this.inputRefs[target.name]);
        if (target.value.charAt(selection.start - 1) === '.') {
          setInputSelection(this.inputRefs[target.name], selection.start - 1, selection.end - 1);
        }
        break;
      }
      default: break;
    }
    this.props.handleKeyPress(evt);
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { filters } = this.props;
    const selection = getInputSelection(this.inputRefs[target.name]);

    const value = formatInputToDate(target.value, '.');
    if (target.value.length < value.length) {
      selection.start += 1;
      selection.end += 1;
    }

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    const selectionObj = {
      name: target.name,
      ...selection,
    };

    this.handleClickOutsideDropdown({ target: null });

    const fields = {
      ...fieldsObj,
      [target.name]: { value, loading: true },
    };

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateDates(fields, selectionObj);
    }, 300);

    this.setState({ fields });
    this.props.updateCustomFilters(fields);
  }

  generateField(data) {
    const { filters } = this.props;
    const { fields } = this.state;

    return (
      <label className={styles.fieldHolder}>
        <InputV2
          setRef={this.setInputRefs}
          autoComplete={'off'}
          onChange={this.handleFieldChange}
          name={data.name}
          value={filters[data.name]}
          placeholder={this.dateFormat}
          onFocus={this.handleFocus}
          onClick={this.handleFocus}
          onKeyDown={this.handleKey}
          className={`${styles.input} ${fields[data.name].error ? 'error' : ''} ${data.name}Input`}
        />
      <SpinnerV2
        className={`${styles.status} ${fields[data.name].loading && filters[data.name] ? styles.show : ''}`}
      />
      <img
        className={`${styles.status} ${!fields[data.name].loading && filters[data.name] ? styles.show : ''}`}
        src={ fields[data.name].error ? svg.alert_icon : svg.ok_icon}
      />
      </label>
    );
  }

  render() {
    const { filters, t } = this.props;
    const { shownDropdown } = this.state;

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{t('Date')}</span>
        <div className={styles.fieldRow}>
          <label
            className={styles.dropdownWrapper}
            ref={this.setDropownRefs}
            data-name={'dateFromDropdown'}>
              { this.generateField({ name: 'dateFrom' }) }
              <DropdownV2
                className={`showLeft ${styles.calendarDropdown}`}
                showDropdown={shownDropdown === 'dateFromDropdown'}>
                <Calendar
                  onDateSelected={date => this.dateSelected(date, 'dateFrom')}
                  dateFormat={this.dateFormat}
                  minDate={moment(firstBlockTime).format(this.dateFormat)}
                  maxDate={filters.dateTo}
                  date={filters.dateFrom} />
              </DropdownV2>
          </label>
          <span className={styles.separator} />
          <label
            className={styles.dropdownWrapper}
            ref={this.setDropownRefs}
            data-name={'dateToDropdown'}>
            { this.generateField({ name: 'dateTo' }) }
            <DropdownV2
              className={`showLeft ${styles.calendarDropdown}`}
              showDropdown={shownDropdown === 'dateToDropdown'}>
            <Calendar
              onDateSelected={date => this.dateSelected(date, 'dateTo')}
              dateFormat={this.dateFormat}
              minDate={filters.dateFrom
                || moment(firstBlockTime).format(this.dateFormat)}
              date={filters.dateTo} />
          </DropdownV2>
          </label>
        </div>
        <Feedback
          className={styles.feedback}
          show={!!this.state.feedback}
          status={this.state.feedback ? 'error' : ''}
          showIcon={false}>
          { this.state.feedback }
        </Feedback>
      </div>
    );
  }
}

export default translate()(DateFieldGroup);
