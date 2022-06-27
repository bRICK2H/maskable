export const input = function (e, h) {
	const { target } = e
		, {
			pos: { min, max }
		} = this

	console.error('input', e, this, h)
}