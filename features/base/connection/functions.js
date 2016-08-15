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
        domain = undefined;
    }

    return domain;
}
