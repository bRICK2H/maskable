const setRange = (ctx, target, h) => {
	const {
		pos,
		pos: { min, max }
	} = ctx

	pos.start = target.selectionStart

	const [start, end] = h.isFullEmpty(ctx)
		? [min, min]
		: h.isNextExistsNumber(ctx)
			? h.findClosestAllowedIndex(ctx)
			: pos.start !== max
				? h.findFirstEmptyIndex(ctx)
				: [max, max]

	pos.start = start
	target.setSelectionRange(start, end)
}

export default function (e, h) {
	const { target } = e
		
	if (target.selectionStart === target.selectionEnd) {
		setRange(this, target, h)
	} else {
		setTimeout(() => {
			if (target.selectionStart === target.selectionEnd) {
				setRange(this, target, h)
			}
		})
	}
}