import React from 'react';
import { FontIcon } from '../fontIcon';

class RadioSelector extends React.Component {
  render() {
    return (
      <div className={this.props.styles.radioGroup}>
        {
          this.props.values.map((val, idx) => (
            <label key={val}>
              <input type='radio'
                className={this.props.styles.radioInput}
                value={val}
                onClick={value => this.props.onChange(value, this.props.name)}
                name={this.props.name} />
              {
                this.props.icons[idx].map(iconKey => (
                    <FontIcon key={`${this.props.iconPrefix}${iconKey}`} value={`${this.props.iconPrefix}${iconKey}`} />
                  ))
              }
              {this.props.labels ? <span>{this.props.labels[idx]}</span> : null}
            </label>
          ))
        }
      </div>
    );
  }
}

export default RadioSelector;
