export default function (e, h) {
	const { key, target } = e
		, { codes, pos: { min } } = this

	codes.past = false

	if (h.isFullEmpty(this)) {
		target.setSelectionRange(min, min)
	}

	if (key === 'Shift') codes.shift = false
	if (key === 'Control') codes.control = false
}