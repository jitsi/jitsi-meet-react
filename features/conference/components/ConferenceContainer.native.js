import React, { Component } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import { styles } from './styles';

/**
 * The native container rendering the conference view.
 */
export class ConferenceContainer extends Component {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <TouchableWithoutFeedback
                onPress={ this.props.onPress }>

                <View style={ styles.conference }>{ this.props.children }</View>
            </TouchableWithoutFeedback>
        );
    }
}

/**
 * ConferenceContainer component's property types.
 *
 * @static
 */
ConferenceContainer.propTypes = {
    children: React.PropTypes.node,
    onPress: React.PropTypes.func
};
