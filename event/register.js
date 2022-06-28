import runEvents from './run'

const EVENTS = [
	'input',
	// 'keyup',
	// 'keydown',
	// 'dblclick',
	'mouseup',
	'mousedown',
]

export default ctx => {
	const { node } = ctx
		,	listener = runEvents.bind(ctx)

	for (const event of EVENTS) {
		node.addEventListener(event, listener)
	}
}