export default function (e, h) {
	const { target, key } = e
		, { codes, pos } = this

		
		codes.past = false
		
		if (key === 'Shift') codes.shift = false
		if (key === 'Control') codes.control = false
		
		e.preventDefault()
	if (target.selectionStart === target.selectionEnd) {
		console.log('full', h.isFullValue(this))
		
		const [start, end] = h.isFullValue(this)
			? h.findAllowedIndex(this)
			: h.findFirstEmptyIndex(this)

		pos.start = start
		target.setSelectionRange(start, end)
	} else {
		if (pos.range) {
			target.setSelectionRange(pos.start, pos.start)
			Promise.resolve().then(() => pos.range = false)
		}

		pos.range = true

	}

}