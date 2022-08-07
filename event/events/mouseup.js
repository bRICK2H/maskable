import isNumber from '../../helpers/detail/isNumber'

export default function (e, h) {
	const { target, key } = e
		, { codes, pos, pos: { min, max } } = this
		
		codes.past = false
		pos.start = target.selectionStart
	
	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
		
	e.preventDefault()

	if (pos.start === target.selectionEnd) {
		const [start, end] = h.isFullEmpty(this)
			? [min, min]
			: h.findClosestAllowedIndex(this)

		pos.start = start
		target.setSelectionRange(start, end)
	} else {
		if (pos.range) {
			target.setSelectionRange(pos.start, pos.start)
			Promise.resolve().then(() => pos.range = false)
		}

		pos.range = true
	}

}