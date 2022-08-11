export default function (e, h) {
	const { target } = e
		, { pos: { min, max } } = this

	const [start] = h.isFullEmpty(this)
		? [min]
		: h.isFullValue(this)
			? [max]
			: h.findFirstEmptyIndex(this)

	target.setSelectionRange(start, start)
}