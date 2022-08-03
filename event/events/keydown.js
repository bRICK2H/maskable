export default function (e, h) {
	const { target, code, key } = e
		, {
			pos,
			codes,
			pos: { start, min, max }
		} = this
		, arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']

	pos.end = target.selectionEnd

	if (key === 'Shift') codes.shift = true
	if (key === 'Control') codes.control = true
	
	codes.delete = code === 'Delete'
	codes.backspace = code === 'Backspace'

	if (code === 'KeyZ' && codes.control) {
		target.value = this.value = this.prevValue
	}
	
	const isArrow = arrows.includes(code) && (!codes.shift && !codes.control)
	
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