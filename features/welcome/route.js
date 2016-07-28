import { RouteRegistry } from '../base/navigation';

import { WelcomePage } from './components';
import { navigate } from './navigationHandler';

/**
 * Register route for welcome page.
 */
RouteRegistry.register({
    component: WelcomePage,
    navigate,
    path: '/'
});
