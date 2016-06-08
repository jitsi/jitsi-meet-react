# jitsi-meet-react


## Launching the App

- For web: `npm run start:web`
- For iOS: `npm run start:ios`

Android should be supported, but there has not been any testing done yet.

## Where things are right now:

- Components that can work anywhere go in `src/components`, but browser or native specific components go in `src/components/browser` and `src/components/native`, respectively.

- Static assets, like images, that apply to all platforms go in `static`.

## Distributions

Right now, only the web target generates a complete client distribution. The `dist/web` output should be able to be loaded directly onto a CDN.

The other targets need further packaging support.

