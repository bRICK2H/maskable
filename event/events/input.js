export default function (e, h, isCapture) {
	const { target } = e
		, 	{ codes, pos } = this

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

		const [start, end] = codes.backspace
			? h.findBackspaceIndex(this)
			: h.findNextAllowedIndex(this, true)
		
		pos.start = start
		target.setSelectionRange(start, end)
	}
}