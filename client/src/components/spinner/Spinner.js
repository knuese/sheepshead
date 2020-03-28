import React from 'react';

import styles from './Spinner.module.css';

const Spinner = (props) => {
    return (
        <div className={styles.Spinner}>
            {[...Array(5)].map((_, i) => (<div key={i}/>))}
        </div>
    );
}

export default Spinner;