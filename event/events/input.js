export default function (e, h, isCapture) {
	const { target } = e
		, 	{ codes, modify, pos } = this
	
	pos.start = target.selectionStart
	this.setValue(target.value)
	
	if (isCapture && modify) {
		target.value = this.modified
	} else {
		const [start, end] = codes.backspace
			? h.findPrevNumberIndex(this)
			: h.findFirstEmptyIndex(this)
		
		target.setSelectionRange(start, end)
	}
}