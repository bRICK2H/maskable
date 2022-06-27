import evenrRun from './run'

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
		,	listener = evenrRun.bind(ctx)

	for (const event of EVENTS) {
		node.addEventListener(event, listener)
	}
}