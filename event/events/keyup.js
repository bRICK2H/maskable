export default function(e) {
	const { key } = e
		,	{ codes } = this

	codes.past = false
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
}