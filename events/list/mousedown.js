export default function (e, f) {
	const { target } = e
		,	{
			pos: { min, max }
		} = this
	
		// setTimeout(() => {
		// 	// e.preventDefault()
		// 	target.setSelectionRange(min, min)
		// })
	e.preventDefault()
	// target.setSelectionRange(min, min)
	console.error('mousedown', e, this, f)
}