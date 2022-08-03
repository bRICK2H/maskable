export default function (e, h) {
	const { target } = e
		,	{ codes, pos } = this

	if (!codes.touchmove) {
		const [start, end] = h.isFullValue(this)
			? h.findAllowedIndex(this)
			: h.findFirstEmptyIndex(this)
	
		pos.start = start
		setTimeout(() => target.setSelectionRange(start, end), 50)
	}

	codes.touchmove = false
}