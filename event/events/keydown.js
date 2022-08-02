export default function (e, h) {
	const { target, code, key } = e
		, {
			pos,
			codes,
			pos: { start, min, max }
		} = this
		, arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']

	pos.end = target.selectionEnd
	codes.backspace = code === 'Backspace'
		
	if (key === 'Shift') codes.shift = true
	if (key === 'Control') codes.control = true
		
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

				const [s] = h.findNextAllowedIndex(this)
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