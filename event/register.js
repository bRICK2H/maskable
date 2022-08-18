import h from '../helpers/cursor'
import mouseup from './events/mouseup'

const EVENTS = [
	'focus',
	'input',
	'paste',
	'keyup',
	'select',
	'keydown',
	'mouseup',
	'touchend',
	'touchmove',
	'mousedown',
]

export default ctx => {
	const { node } = ctx

	for (const event of EVENTS) {
		const {
			default: listener
		} = require(`./events/${event}.js`)

		node.addEventListener(event, e => listener.call(ctx, e, h))
	}

	document.addEventListener('mouseup', () => {
		const { mouseEvent } = ctx
		
		if (mouseEvent) mouseup.call(ctx, mouseEvent, h)
		ctx.mouseEvent = null
	})
}