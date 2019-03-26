import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import darkLogo from '../../assets/images/logo/lisk-logo-dark.svg';
import whiteLogo from '../../assets/images/logo/lisk-logo-white.svg';
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
      dark,
    } = this.props;
    return (
      <header className={`${styles.wrapper} mainHeader ${dark ? 'dark' : ''}`}>
        <div className={`${styles.logo}`}>
          <img src={dark ? whiteLogo : darkLogo} />
        </div>
        <div className={`${styles.buttonsHolder}`}>
          {showNetwork
            && <span className={`${styles.dropdownHandler} network`}
              onClick={this.toggleDropdown}>
              { networkList[selectedNetwork].label }
              <DropdownV2 showArrow={false} showDropdown={this.state.showDropdown}>
                {networkList && networkList.map((network, key) => (
                  <span
                    onClick={() => handleNetworkSelect(network.value)}
                    key={key}>{network.label}</span>
                ))}
              </DropdownV2>
            </span>
          }
          {showSettings
            && <Link className={styles.settingButton} to={routes.setting.path}>
              <SecondaryButtonV2 className={`${dark ? 'light' : ''}`}>
                {t('Settings')}
              </SecondaryButtonV2>
            </Link>
          }
        </div>
      </header>
    );
  }
}

export default translate()(HeaderV2);
