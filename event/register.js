import runEvents from './run'

const EVENTS = [
	'input',
	// 'keyup',
	'keydown',
	// 'dblclick',
	'pointerup',
	'pointerdown',
]

export default ctx => {
	const { node } = ctx
		,	listener = runEvents.bind(ctx)

	for (const event of EVENTS) {
		if (event === 'input') {
			node.addEventListener(event, listener, { capture: true })
		} else {
			node.addEventListener(event, listener)
		}
	}
}