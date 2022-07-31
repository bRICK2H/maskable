export default function(e, h) {
	const { target, code } = e
		, 	{ codes, pos } = this
		
	codes.backspace = code === 'Backspace'
	pos.start = target.selectionStart
	// console.error('mousedown', e, this, h)
}