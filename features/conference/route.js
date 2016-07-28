import { RouteRegistry } from '../base/navigation';

import { Conference } from './components';
import { navigate } from './navigationHandler';

/**
 * Register route for conference page.
 */
RouteRegistry.register({
    component: Conference,
    navigate,
    path: '/:room'
});
