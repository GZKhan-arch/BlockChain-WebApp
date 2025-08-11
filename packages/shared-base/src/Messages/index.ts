import { WebExtensionMessage } from '@dimensiondev/holoflows-kit'
import type { MaskEvents } from './Events.js'
import { encoder } from '../serializer/index.js'
import type { PluginMessageEmitter } from './CrossIsolationEvents.js'

const m = new WebExtensionMessage<MaskEvents>({ domain: 'mask' })
m.encoder = encoder

export const MaskMessages: { readonly events: PluginMessageEmitter<MaskEvents> } = m
