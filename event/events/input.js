import isNumber from '../../helpers/detail/isNumber'

export default function (e, h) {
	const { target } = e
		, { codes, char, pos, pos: { start, max } } = this
	
	pos.end = target.selectionEnd
	pos.start = codes.past
		? pos.max
		: target.selectionStart

	this.setValue(target.value)

	if (!codes.delete) {
		if (codes.backspace) {
			const [prevIndex] = h.findBackspaceIndex(this)

			pos.start = prevIndex
		} else {
			const [nextIndex] = h.findNextAllowedIndex(
				this,
				!h.isNextExistsNumber(this) // jump
			)
			, prevSymbol = target.value[nextIndex - 1]
			, currSymbol = target.value[nextIndex]

			if (!this.pos.block) {
				pos.start = !isNumber(prevSymbol)
					&& isNumber(currSymbol)
					&& prevSymbol !== char
						? nextIndex + 1
						: this.isSystemIndex
							? h.findNextSystemIndex(this)
							: nextIndex
			} else {
				const {
					pos: { select }
				} = this
				
				pos.start = select.isSelect ? select.start : start
			}
		}
	} else {
		pos.start = start >= max
			? max
			: pos.start += 1

		const [nextIndex] = h.findNextArrowRirghtIndex(this)
		pos.start = nextIndex
	}

	pos.end = pos.start
	this.pos.block = false
	
	target.setSelectionRange(pos.start, pos.start)
}