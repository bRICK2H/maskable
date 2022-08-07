export default function (e, h) {
	const { target } = e
		,	{ codes, pos } = this

	// Разобраться с мобилой !!
	pos.start = target.selectionStart
	e.preventDefault()

	if (!codes.touchmove) {
		const [start, end] = h.isFullEmpty(this)
			? [min, min]
			: h.findClosestAllowedIndex(this)
	
		pos.start = start
		target.setSelectionRange(start, end)
		// setTimeout(() => target.setSelectionRange(start, end), 20)
	}

	codes.touchmove = false
}