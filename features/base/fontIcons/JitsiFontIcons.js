import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './fonts/selection.json';

/**
 * Creates the Jitsi icon set from the ico moon project config file.
 */
const JitsiFontIcons = createIconSetFromIcoMoon(icoMoonConfig);

module.exports = JitsiFontIcons;
