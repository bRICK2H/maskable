export default function (e, h) {
	const { target } = e
		, { pos, pos: { min, max } } = this

	const [start] = h.isFullEmpty(this)
		? [min]
		: h.isFullValue(this)
			? [max]
			: h.findFirstEmptyIndex(this)

	pos.start = pos.end = start
	target.setSelectionRange(start, start)
}