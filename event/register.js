import h from '../helpers/cursor'

const EVENTS = [
	'focus',
	'input',
	'paste',
	'keyup',
	'keydown',
	'mouseup',
	'touchend',
	'touchmove',
]

export default ctx => {
	const { node } = ctx

	for (const event of EVENTS) {
		const {
			default: listener
		} = require(`./events/${event}.js`)

		node.addEventListener(event, e => listener.call(ctx, e, h))
	}
}