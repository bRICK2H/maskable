let isControl = false

export default function(e, h) {
	const { target, code, key } = e
		, 	{ codes, pos } = this
	// 	, 	isKeyV = code === 'KeyV'
	
	// if (!isKeyV) {
	// 	isControl = !isKeyV && key === 'Control'
	// }

	pos.end = target.selectionEnd
	// codes.past = isKeyV && isControl
	codes.backspace = code === 'Backspace'
}