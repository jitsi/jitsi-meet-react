/**
 * Returns current domain.
 *
 * @param {(Function|Object)} stateOrGetState - Redux getState() method or Redux
 * state.
 * @returns {(string|undefined)}
 */
export function getDomain(stateOrGetState) {
    const state = typeof stateOrGetState === 'function'
        ? stateOrGetState()
        : stateOrGetState;

    const connection = state['features/base/connection'];
    let domain;

    try {
        domain = connection.connectionOptions.hosts.domain;
    } catch (e) {
        // XXX ConnectionOptions or any of its child properties may be undefined
        // at some point (e.g. on start), so instead of multiple checks for
        // undefined value we just wrap it in a try-catch block.
    }

    return domain;
}
