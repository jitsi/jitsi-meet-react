import AbstractContainer from './AbstractContainer';

/**
 * Represents a container of React Component children with a style.
 *
 * @extends AbstractContainer
 */
export class Container extends AbstractContainer {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        // eslint-disable-next-line prefer-const
        let { style, visible, ...props } = this.props;

        // visible
        if (typeof visible !== 'undefined' && !visible) {
            style = {
                ...style,
                display: 'none'
            };
        }

        // eslint-disable-next-line object-property-newline
        return this._render('div', { ...props, style });
    }
}

/**
 * Container component's property types.
 *
 * @static
 */
Container.propTypes = AbstractContainer.propTypes;
