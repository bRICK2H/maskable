export default function (e, h) {
	const { target } = e
		, { codes, pos, pos: { start, max } } = this
	
	pos.start = codes.past
		? pos.max
		: target.selectionStart

	this.setValue(target.value)

	if (!codes.delete) {
		const [s] = codes.backspace
			? h.findBackspaceIndex(this)
			: h.findNextAllowedIndex(this, true)

		pos.start = !codes.backspace
			? h.findLastNumberIndex(this) : s
	} else {
		pos.start = start >= max
			? max
			: pos.start += 1

		const [s] = h.findNextArrowRirghtIndex(this)
		pos.start = s
	}

	target.setSelectionRange(pos.start, pos.start)
}