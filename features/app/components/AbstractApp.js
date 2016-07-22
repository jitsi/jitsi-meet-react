import React, { Component } from 'react';

import { start, stop } from '../actions';

/**
 * Base (abstract) class for main App component.
 *
 * @abstract
 */
export class AbstractApp extends Component {
    /**
     * Start app when component is going to be mounted.
     *
     * @inheritdoc
     */
    componentWillMount() {
        this.props.store.dispatch(start(this.props.config));
    }

    /**
     * Stop app when component is going to be unmounted.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this.props.store.dispatch(stop());
    }
}

/**
 * AbstractWelcomePage component's property types.
 *
 * @static
 */
AbstractApp.propTypes = {
    config: React.PropTypes.object,
    store: React.PropTypes.object
};