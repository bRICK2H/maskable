export default function(e, h) {
	const { target, code } = e
		, 	{ codes } = this
		
	codes.backspace = code === 'Backspace'
	// console.error('mousedown', e, this, h)
}