export default function(e) {
	const { target, key } = e
		,	{ pos, codes } = this

	codes.past = false
	pos.end = target.selectionEnd
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
}