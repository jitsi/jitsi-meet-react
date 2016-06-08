import LibJitsi from 'lib-jitsi-meet';


import {
    JITSI_CLIENT_CREATED,
    JITSI_CLIENT_ERROR
} from './';


export function init(config, room) {
    return (dispatch, getState) => {
        LibJitsi.init({}).then(() => {
            const client = new LibJitsi.JitsiConnection(
                config.appId,
                config.token,
                {
                    ...config.connection,
                    bosh: config.connection.bosh + ( room ? ('?room=' + room) : '' )
                }
            );
            dispatch(clientInitialized(client));

            client.connect();
        }).catch(error => {
            dispatch(clientError(error));
        });
    };
}


export function clientInitialized(client) {
    return {
        type: JITSI_CLIENT_CREATED,
        client
    };
}

export function clientError(error) {
    console.error(error);
    return {
        type: JITSI_CLIENT_ERROR,
        error
    };
}

