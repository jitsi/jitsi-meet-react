/**
 * Loads a script from a specific source. This is an extended version of
 * loadScript method from ScriptUtil in lib-jitsi-meet.
 *
 * @param {string} src - The source from the which the script is to be
 * (down)loaded. Can be absolute or relative URL.
 * @param {Object} options - Additional options.
 * @param {boolean} options.async=true - True to asynchronously load the script
 * or false to synchronously load the script.
 * @param {boolean} options.prepend=false - True to schedule the loading of the
 * script as soon as possible or false to schedule the loading of the script at
 * the end of the scripts known at the time.
 * @returns {void}
 */
export function loadScript(
    src,
    options = {
        async: true,
        prepend: false
    }) {
    return new Promise((resolve, reject) => {
        const d = document;
        const tagName = 'script';
        const script = d.createElement(tagName);
        const referenceNode = d.getElementsByTagName(tagName)[0];

        let scriptSource = src;

        if (isRelativeURL(src)) {
            // Finds the src url of the current loaded script and use it as
            // base of the src supplied argument.
            // TODO Check if this is sufficient or we should use
            // 'current-executing-script' lib.
            const scriptEl = document.currentScript;

            if (scriptEl) {
                const scriptSrc = scriptEl.src;
                const baseScriptSrc
                    = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);

                if (scriptSrc && baseScriptSrc) {
                    scriptSource = new URL(src, baseScriptSrc).toString();
                }
            }
        }

        script.async = Boolean(options.async);
        script.onerror = reject;
        script.onload = resolve;
        script.src = scriptSource;

        if (referenceNode) {
            if (options.prepend) {
                referenceNode.parentNode.insertBefore(script, referenceNode);
            } else {
                referenceNode.parentNode.appendChild(script);
            }
        } else {
            const head = d.getElementsByTagName('head')[0];

            head.appendChild(script);
        }
    });
}

/**
 * Determines if passed URL is relative or not.
 *
 * @param {string} url - URL.
 * @returns {boolean}
 */
function isRelativeURL(url) {
    let isRelative;

    // XXX If passed argument is an absolute URL, then URL object will be
    // correctly created. If it will fail with exception, that means it's not
    // a correct absolute URL and we will treat it as relative.
    try {
        new URL(url); // eslint-disable-line no-new
    } catch (ex) {
        isRelative = true;
    }

    return isRelative;
}
