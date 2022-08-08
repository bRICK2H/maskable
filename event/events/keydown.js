import isNumber from "../../helpers/detail/isNumber"

export default function (e, h) {
	const { target, code, key } = e
		, {
			pos,
			codes,
			pos: { start, min, max }
		} = this
		, arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']

	if (key === 'Shift') codes.shift = true
	if (key === 'Control') codes.control = true
	
	codes.delete = code === 'Delete'
	codes.backspace = code === 'Backspace'
	
	if (code === 'KeyZ' && codes.control) {
		e.preventDefault()
		target.value = this.value = this.prevValue

		const [index] = isNumber(target.value[pos.start])
			? [pos.start + 1]
			: h.findPrevDeletedCharIndex(this)

		target.setSelectionRange(index, index)
	}
	
	const isArrow = arrows.includes(code) && (!codes.shift && !codes.control)

	const rStart = target.selectionStart
		, rEnd = target.selectionEnd

	if (rStart !== rEnd) {
		target.selectionStart = rStart <= min
			? min : h.findLeftArrowSelectIndex(this)
	}
	
	if (isArrow) {
		e.preventDefault()

		switch (key) {
			case 'ArrowLeft': {
				pos.start = start <= min
					? min
					: pos.start -= 1

				const [s] = h.findPrevAllowedIndex(this)
				pos.start = s
			}
				break

			case 'ArrowRight': {
				pos.start = start >= max
					? max
					: pos.start += 1

				const [s] = h.findNextArrowRirghtIndex(this)
				pos.start = s
			}
				break

			case 'ArrowUp': {
				pos.start = min
			}
				break

			case 'ArrowDown': {
				pos.start = max
			}
				break
		}

		target.setSelectionRange(pos.start, pos.start)
	}

}