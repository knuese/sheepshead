import React from 'react';

import Hand from '../hand/Hand';
import styles from './Table.module.css';

const Table = (props) => {
    return (
        <div className={styles.Table}>
            <div className={`${styles.opp} ${styles.opp1}`}>Opponent 1</div>
            <div className={`${styles.opp} ${styles.opp2}`}>Opponent 2</div>
            <div className={`${styles.opp} ${styles.opp3}`}>Opponent 3</div>
            <div className={`${styles.opp} ${styles.opp4}`}>Opponent 4</div>
            <Hand numHands={5}/>
        </div>
    )
}

export default Table;