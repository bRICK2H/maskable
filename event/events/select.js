export default function (e) {
	const { target } = e
		, { pos: { select } } = this
	
	select.end = target.selectionEnd
	select.start = target.selectionStart
	select.isSelect = select.start !== select.end
}