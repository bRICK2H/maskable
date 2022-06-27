export const mouseup = function (e, h) {
	const { target } = e
		, {
			pos: { min, max }
		} = this

	console.error('mouseup', e, this, h)
}