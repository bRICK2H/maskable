export const mouseup = function (e, h) {
	const { target } = e
		, {
			pos: { min, max }
		} = this

	// console.error('mouseup', e, this, h)
	if (!h.isFullValue(this)) {
		const [start, end] = h.findFirstEmpty(this)
		target.setSelectionRange(start, end)
	}
}