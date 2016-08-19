import { styles as baseStyles } from './baseStyles';

// XXX 'flex: 0' in browser environment (Chrome at least) is resolved to
// 'flex: 0 1 0%', while we need 'flex: 0 1 auto' value here, which actually
// corresponds to 'initial' shorthand.
export const styles = {
    ...baseStyles,
    avatar: {
        ...baseStyles.avatar,
        flex: 'initial'
    }
};
