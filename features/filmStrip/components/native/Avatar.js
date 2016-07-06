import React, { Component } from 'react';
import { Image } from 'react-native';

import styles from './styles/Styles';


/**
 * Display a participant avatar.
 */
export class Avatar extends Component {

    /**
     * React render method.
     *
     * @inheritdoc
     */
    render() {
        return (
            <Image
                source = {{
                    uri: this.props.uri
                }}
                style = { styles.avatar } />
        );
    }
}

