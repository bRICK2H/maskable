export default function (e, h, isCapture) {
	const { target } = e
		, 	{ codes, pos, pos: { start, max } } = this

	if (isCapture) {
		pos.start = codes.past
			? pos.max
			: target.selectionStart
		
		this.setValue(target.value)
		target.value = this.modified
	} else {
		if (this.modified === this.prevModified) {
			target.value = this.value
		}
		
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
}