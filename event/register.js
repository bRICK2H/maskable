import runEvents from './run'

const EVENTS = [
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
		, 	bubblingListener = runEvents.bind(ctx, false)
		, 	capturingListener = runEvents.bind(ctx, true)

	for (const event of EVENTS) {
		if (event === 'input') {
			// Регистрация input при погружении
			node.addEventListener(event, capturingListener, { capture: true })
			// Регистрация input при всплытии
			node.addEventListener(event, bubblingListener)
		} else {
			// Регистрация событий при всплытии
			node.addEventListener(event, bubblingListener)
		}
	}
}