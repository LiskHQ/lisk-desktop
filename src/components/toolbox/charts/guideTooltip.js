import React from 'react';
import PropTypes from 'prop-types';
import styles from './guideTooltip.css';
import Tooltip from '../tooltip/tooltip';

const CustomIcon = () => (
    <div className={styles.container}>
            <div className={styles.quarterTile}>
                <div className={`${styles.tile} ${styles.green}`}></div>
                <div className={`${styles.tile} ${styles.blue}`}></div>
                <div className={`${styles.tile} ${styles.yellow}`}></div>
                <div className={`${styles.tile} ${styles.orange}`}></div>
            </div>
            <span className={styles.label}>Guides</span>
        </div>
)

const GuideTooltip = ({ children }) => {
    return (
        <Tooltip position="bottom right" indent content={<CustomIcon/>}>
            <main>{children}</main>
        </Tooltip>
    )
};

GuideTooltip.propTypes = {
    children: PropTypes.node.isRequired
};

GuideTooltip.defaultProps = {
    children: <React.Fragment />
};

export default GuideTooltip;