import React from 'react';

import styles from './Spinner.module.css';

const Spinner = (props) => {
    return (
        <div className={styles.Spinner}>
            {[...Array(30 / props.numHands)].map(_ => (<div/>))}
        </div>
    );
}

export default Spinner;