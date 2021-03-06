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
	const { node, isModified } = ctx
		, 	bubblingListener = runEvents.bind(ctx, false)
		, 	capturingListener = runEvents.bind(ctx, true)

	for (const event of EVENTS) {
		if (event === 'input') {
			node.addEventListener(event, capturingListener, { capture: true })
			
			if (isModified) {
				node.addEventListener(event, bubblingListener)
			}
		} else {
			node.addEventListener(event, bubblingListener)
		}
	}
}