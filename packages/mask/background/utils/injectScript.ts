import { Sniffings } from '@masknet/shared-base'
import { memoize } from 'lodash-es'

export const injectedScriptURL = '/js/injected-script.js'
export const maskSDK_URL = '/js/mask-sdk.js'

export async function evaluateContentScript(tabId: number | undefined, frameId?: number) {
    if (browser.scripting) {
        if (tabId === undefined) {
            const activeTab = await browser.tabs.query({ active: true })
            if (!activeTab.length) return
            tabId = activeTab[0].id
        }
        if (!tabId) return
        const script = {
            target: { tabId, frameIds: frameId ? [frameId] : undefined },
            files: contentScriptList,
            world: 'ISOLATED' as any,
        }
        if (Sniffings.is_firefox) delete script.world
        await browser.scripting.executeScript(script)
    } else {
        for (const script of contentScriptList) {
            await browser.tabs.executeScript(tabId, {
                file: script,
                frameId,
                runAt: 'document_idle',
            })
        }
    }
}
export const contentScriptList = [
    '/js/patches.js',
    '/js/polyfill/ecmascript.js',
    '/js/polyfill/dom.js',
    '/js/polyfill/browser-polyfill.js',
    '/js/sentry.js',
    '/js/sentry-patch.js',
    '/js/polyfill/lockdown.js',
    '/js/trusted-types.js',
    '/js/lockdown.js',
    '/js/module-loader.js',
    '/cs.js',
]

async function injectUserScriptMV2_raw(url: string) {
    try {
        const code = await fetch(url).then((x) => x.text())
        return `{
            const script = document.createElement("script")
            script.innerHTML = ${JSON.stringify(code)}
            document.documentElement.appendChild(script)
        }`
    } catch (error) {
        console.error(error)
        return `console.log('[Mask] User script ${url} failed to load.')`
    }
}
export const injectUserScriptMV2 =
    process.env.NODE_ENV === 'development' ? injectUserScriptMV2_raw : memoize(injectUserScriptMV2_raw)

export function ignoreInjectError(arg: unknown): (reason: Error) => void {
    return (error) => {
        const ignoredErrorMessages = ['non-structured-clonable data', 'No tab with id']
        if (ignoredErrorMessages.some((x) => error.message.includes(x))) return
        console.error('[Mask] Inject error', error.message, arg, error)
    }
}
