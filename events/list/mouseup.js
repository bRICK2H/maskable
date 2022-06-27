export default function (e) {
	const { target } = e
		, {
			pos: { min, max }
		} = this
	
	// setTimeout(() => {
	// 	target.setSelectionRange(min, min)
	// })
	console.error('mouseup', e, this)
}