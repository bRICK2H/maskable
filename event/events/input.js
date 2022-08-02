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

		const [start] = codes.backspace
			? h.findBackspaceIndex(this)
			: h.findNextAllowedIndex(this, true)
		

		// pos.start = start
		
		// target.setSelectionRange(start, start)
		// console.warn(this.validCounter && !codes.backspace)
		
		const startAfterSplice = !codes.backspace
			? h.findLastNumberIndex(this) : start
		pos.start = startAfterSplice
		
		target.setSelectionRange(startAfterSplice, startAfterSplice)
	}
}