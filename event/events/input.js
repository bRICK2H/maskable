import isNumber from '../../helpers/detail/isNumber'

export default function (e, h) {
	const { target } = e
		, { codes, char, pos, pos: { start, max } } = this
	
	pos.start = codes.past
		? pos.max
		: target.selectionStart

	this.setValue(target.value)

	if (!codes.delete) {
		if (codes.backspace) {
			const [s] = h.findBackspaceIndex(this)

			pos.start = s
		} else {
			console.log()
			const [s] = h.findNextAllowedIndex(this, !h.isNextExistsNumber(this))
			, prevSymbol = target.value[s - 1]
			, currSymbol = target.value[s]

			pos.start = !isNumber(prevSymbol)
				&& isNumber(currSymbol)
				&& prevSymbol !== char
					? s + 1 : s
		}
	} else {
		pos.start = start >= max
			? max
			: pos.start += 1

		const [s] = h.findNextArrowRirghtIndex(this)
	}

	target.setSelectionRange(pos.start, pos.start)
}