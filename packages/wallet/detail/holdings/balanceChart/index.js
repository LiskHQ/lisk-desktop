import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@token/fungible/consts/tokens';
import {
  getChartDateFormat,
  graphOptions,
  getBalanceData,
} from '@views/utilities/balanceChart';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import BoxEmptyState from '@basics/box/emptyState';
import { LineChart } from '@basics/charts';
import Icon from '@basics/icon';
import i18n from '@setup/i18n/i18n';
import styles from './balanceChart.css';

const BalanceGraph = ({
  t, transactions, token, isDiscreetMode, balance, address,
}) => {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState({});
  const theme = useSelector(state => (state.settings.darkMode ? 'dark' : 'light'));

  useEffect(() => {
    if (data) {
      setData(null);
    }
  }, [token]);

  useEffect(() => {
    if (transactions.length && balance !== undefined) {
      const format = getChartDateFormat(transactions, token);
      setOptions(graphOptions({
        format,
        token,
        locale: i18n.language,
      }));

      setData(getBalanceData({
        transactions,
        balance,
        address,
        format,
        token,
        theme,
      }));
    }
  }, [transactions, theme]);

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('{{token}} balance', { token: tokenMap[token].label })}</h2>
        {
          data && !isDiscreetMode && (
            <LineChart
              data={data}
              options={options}
            />
          )
        }
        {
          isDiscreetMode && (
            <div className={styles.discreetMode}>
              <Icon name="discreetMode" className={styles.icon} />
              <p>The balance chart is not visible in discreet mode.</p>
            </div>
          )
        }
        {
          !data && !isDiscreetMode && (
            <BoxEmptyState>
              <p>
                {t('There are no transactions.')}
              </p>
            </BoxEmptyState>
          )
        }
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceGraph);
