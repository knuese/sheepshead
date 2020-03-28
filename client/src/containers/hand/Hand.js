import React, { Component } from 'react';
import axios from 'axios';

import Card from '../../components/card/Card';
import Spinner from '../../components/spinner/Spinner';
import styles from './Hand.module.css';

class Hand extends Component {
    state = {
        loading: true,
        cards: []
    }

    componentDidMount() {
        this.getHand()
                .then((res) => this.setState({ cards: res.data.cards, loading: false }))
                .catch((err) => console.log(`An error occurred while calling the API: ${err}`));
    }

    getHand = () => {
        return axios.get('/game/new');
    }

    render() {
        let content = <Spinner numHands={this.props.numHands}/>;

        if (!this.state.loading) {
            content = this.state.cards.map(c => (<Card type={c} key={c}/>));
        }

        return (
            <div className={styles.Hand}>
                {content}
            </div>
        );
    }
}

export default Hand;