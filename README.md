# jitsi-meet-react

This project is able to target five rendering platforms: Web, iOS, Android, and Desktop (via Electron or NWJS).


## Launching the App

- For web: `npm run start:web`
- For desktop: `npm run start:desktop` (or `npm run start:nwjs` for the NWJS version)
- For iOS: `npm run start:ios`

Android should be supported, but there has not been any testing done yet.

## Where things are right now:

- Components that can work anywhere go in `src/components`, but browser or native specific components go in `src/components/browser` and `src/components/native`, respectively.

- Static assets, like images, that apply to all platforms go in `static`. Assets that are specific to the Web version go in `web/static`, and assets specific to the desktop version go in `desktop/static`.

- Configuration for web and desktop can be found in `web/[NODE_ENV].config.js` and `desktop/[NODE_ENV].development.js`, where `[NODE_ENV]` is based on the environment used to generate the build. There are two additional configuration file, `web/injected.config.js` and `desktop/injected.config.js` that allow injecting configuration as a separate script that will be loaded into the page.

