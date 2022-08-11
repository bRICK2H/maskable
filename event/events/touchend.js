export default function (e, h) {
	const { target } = e
		,	{ codes, pos, pos: { min } } = this

	setTimeout(() => {
		pos.end = target.selectionEnd
		pos.start = target.selectionStart

		if (pos.end === pos.start && !codes.touchmove) {
			const [start] = 
				h.isFullEmpty(this) || pos.start < min
					? [min, min]
					: h.findClosestAllowedIndex(this)

			target.setSelectionRange(start, start)
			pos.start = start
		} else {
			const [start, end] = h.findRangeAllowedIndex(this)
			target.setSelectionRange(start, end)
		}
		
	}, 20)
	
	codes.touchmove = false
}