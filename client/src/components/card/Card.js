import React from 'react';

import styles from './Card.module.css';

const Card = (props) => {
    return (
        <div className={styles.Card}>
            <img src={require(`../../assets/images/cards/${props.type}.png`)} alt='A card'/>
        </div>
    );
}

export default Card