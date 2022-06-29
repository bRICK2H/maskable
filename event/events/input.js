export default function (e, h) {
	const { target } = e
		,	{ codes } = this
	
	this.setValue(target.value)

	const [start, end] = codes.backspace
		? h.findPrevNumberIndex(this)
		: h.findFirstEmptyIndex(this)

	target.setSelectionRange(start, end)
}