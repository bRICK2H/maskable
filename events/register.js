import eventHandler from './handler'

const EVENTS = [
	'input',
	// 'keyup',
	// 'keydown',
	// 'mouseup',
	// 'dblclick',
	// 'mousedown',
]

export default ctx => {
	const { node } = ctx
		,	listener = eventHandler.bind(ctx)

	for (const event of EVENTS) {
		node.addEventListener(event, listener)
	}
}