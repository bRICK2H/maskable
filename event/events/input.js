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
			? h.findPrevNumberIndex(this)
				?? [pos.min, pos.min]
			: h.findFirstEmptyIndex(this)
				?? h.findNextNumberIndex(this)
				?? [pos.max, pos.max]

		target.setSelectionRange(start, end)
	}
}