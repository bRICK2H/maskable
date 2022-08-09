export default function(e, h) {
	const { target, key } = e
		,	{ codes } = this

	codes.past = false
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false

	// const [start, end] = h.findRangeAllowedIndex(this)
	// target.setSelectionRange(start, end)
}