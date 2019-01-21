import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import logo from '../../assets/images/lisk-logo-v2.svg';
import routes from '../../constants/routes';
import styles from './headerV2.css';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';

class HeaderV2 extends React.Component {
  constructor() {
    super();

    this.state = {
      showDropdown: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    const showDropdown = !this.state.showDropdown;
    this.setState({ showDropdown });
  }

  render() {
    const {
      t, showSettings, showNetwork, networkList,
      selectedNetwork, handleNetworkSelect,
    } = this.props;
    return (
      <header className={`${styles.wrapper} mainHeader`}>
        <div className={`${styles.logo}`}>
          <img src={logo} />
        </div>
        <div className={`${styles.buttonsHolder}`}>
          {showSettings
            && <Link className={styles.settingButton} to={routes.setting.path}>
              <SecondaryButtonV2>{t('Settings')}</SecondaryButtonV2>
            </Link>
          }
          {showNetwork
            && <span className={`${styles.dropdownHandler} network`}
              onClick={this.toggleDropdown}>
              { networkList[selectedNetwork].label }
              <DropdownV2 showDropdown={this.state.showDropdown}>
                {networkList && networkList.map((network, key) => (
                  <span
                    onClick={() => handleNetworkSelect(network.value)}
                    key={key}>{network.label}</span>
                ))}
              </DropdownV2>
            </span>
          }
        </div>
      </header>
    );
  }
}

export default translate()(HeaderV2);
