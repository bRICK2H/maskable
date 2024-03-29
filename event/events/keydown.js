import isNumber from "../../helpers/detail/isNumber"

export default function (e, h) {
	const { 
		key,
		code,
		which,
		target,
		keyCode,
	} = e
	, {
		pos,
		codes,
		pos: { start, min, max }
	} = this
	, arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
	, directionSelect = target.selectionDirection

	if (key === 'Shift') codes.shift = true
	if (key === 'Control') codes.control = true

	codes.which = which
	codes.delete = code === 'Delete'
	codes.backspace = code === 'Backspace'
		|| key === 'Backspace'
		|| keyCode === 8
		|| which === 8
	
	if (code === 'KeyZ' && codes.control) {
		e.preventDefault()
		target.value = this.value = this.prevValue

		const [index] = isNumber(target.value[pos.start])
			? [pos.start + 1]
			: h.findPrevDeletedCharIndex(this)

		target.setSelectionRange(index, index)
	}
	
	if (arrows.includes(code)) {

		if (!codes.shift && !codes.control) {
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

			pos.end = pos.start
			target.setSelectionRange(pos.start, pos.start)
		} else {
			const rStart = target.selectionStart
			, rEnd = target.selectionEnd

			if (rStart !== rEnd) {
				switch (key) {
					case 'ArrowLeft': {
						if (directionSelect === 'backward') {
							target.selectionStart = pos.start =
								rStart <= min
									? min + 1
									: h.findLeftArrowSelectIndex(this, 'left', 1)
	
							pos.end = rEnd
						} else {
							target.selectionEnd = pos.end =
								rEnd < max
									? h.findLeftArrowSelectIndex(this, 'right', 2)
									: max
						}
					}
						break

					case 'ArrowRight': {
						if (directionSelect === 'forward') {
							target.selectionEnd = pos.end =
								rEnd < max
									? h.findRightArrowSelectIndex(this, 'left', 0)
									: max
	
							pos.start = rStart
						} else {
							target.selectionStart = pos.start =
								rStart <= min
									? min
									: h.findRightArrowSelectIndex(this, 'right', 1)
						}
					}
						break

					case 'ArrowUp': {
						// if (rStart <= min) {
						// 	target.selectionStart = pos.start = min
						// }
					}
						break
				}
				
			}
		}

		
	}

}