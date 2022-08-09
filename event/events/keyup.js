export default function(e, h) {
	const { key } = e
		,	{ codes } = this

	codes.past = false
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
}