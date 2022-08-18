import isNumber from '../../helpers/detail/isNumber'

const setRange = (ctx, target, h) => {
	const {
		pos,
		value,
		pos: { min, max }
	} = ctx

	pos.start = target.selectionStart

	const [start, end] = h.isFullEmpty(ctx)
		? [min, min]
		: h.isNextExistsNumber(ctx)
			? h.findClosestAllowedIndex(ctx)
			: pos.start === max
				? !isNumber(value[pos.start - 1])
					? h.findFirstEmptyIndex(ctx)
					: [max, max]
				: h.findFirstEmptyIndex(ctx)

	pos.end = end
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
			} else {
				const [start, end] = h.findRangeAllowedIndex(this)
				target.setSelectionRange(start, end)
			}
		})
	}
}