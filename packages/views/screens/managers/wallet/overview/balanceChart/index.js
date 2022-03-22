import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import {
  getChartDateFormat,
  graphOptions,
  getBalanceData,
} from '@common/utilities/balanceChart';
import Box from '@views/basics/box';
import BoxContent from '@views/basics/box/content';
import BoxEmptyState from '@views/basics/box/emptyState';
import { LineChart } from '@views/basics/charts';
import Icon from '@views/basics/icon';
import i18n from '../../../../../i18n';
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
