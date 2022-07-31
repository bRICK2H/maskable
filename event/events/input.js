export default function (e, h, isCapture) {
	const { target } = e
		, 	{ codes, pos } = this

	if (isCapture) {
		pos.start = target.selectionStart
		
		this.setValue(target.value)
		target.value = this.modified
	} else {
		this.prevValue = target.value
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