export const input = function (e, h) {
	const { target } = e
	
	this.setValue(target.value)

	const [start, end] = h.findFirstEmpty(this)
	target.setSelectionRange(start, end)
}