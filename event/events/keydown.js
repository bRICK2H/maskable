export default function (e, h) {
	const { target, code, key } = e
		, {
			pos,
			char,
			value,
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
		console.log(pos.start, value)
		e.preventDefault()

		// setTimeout(() => {
			// let locStart = target.selectionStart

			switch (key) {
				case 'ArrowLeft': {
					if (start <= min) {
						pos.start = min
					} else {
						pos.start -= 1
					}
				}
					break

				case 'ArrowRight': {
					if (start >= max) {
						pos.start = max
					} else {
						pos.start += 1
					}

					const [s] = h.findNextAllowedIndex(this)
					pos.start = s

					console.log('right', pos.start)
				}
					break
			}
			
			target.setSelectionRange(pos.start, pos.start)
		// })
	}

}