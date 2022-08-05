export default function (e, h) {
	const { target, key } = e
		, { codes, pos, pos: { min, max } } = this
		
		codes.past = false
		pos.start = target.selectionStart
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
		
	e.preventDefault()

	if (pos.start === target.selectionEnd) {
		// const [start, end] = h.isFullValue(this)
		// 	? h.findAllowedIndex(this)
		// 	: h.findFirstEmptyIndex(this)

		// findAllowedIndex - нужно немного модифицировать
		const [start, end] = h.isFullEmpty(this)
			? [min, min]
			: h.isNeighborEmpty(this)
				? h.findFirstEmptyIndex(this) 
				: h.findAllowedIndex(this)
			// ? h.findAllowedIndex(this)
			// : h.findFirstEmptyIndex(this)

		console.log(h.isNeighborEmpty(this))

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