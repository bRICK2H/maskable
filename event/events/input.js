const getRefContentValue = vnode => {
	const { data, context } = vnode
		, vMaskable = data?.directives.find(({ name }) => name === 'maskable')

	if (vMaskable) {
		const { expression } = vMaskable
			, refValue = (ctx, key) => {
				return typeof ctx[key] === 'object'
					? refValue(ctx[key], String(Object.keys(ctx[key])))
					: { ctx, key }
			}
			, variable = expression
				.replace(/[^\w,]/g, '')
				.replace(/_/g, '')
				.split(',')
				.find(curr => context.hasOwnProperty(curr))

		if (variable) {
			const { ctx, key } = refValue(context, variable)

			return { ctx, key }
		}

		return null
	}
}


export default function (e, h) {
	const { target } = e
		, { codes, pos, pos: { start, max } } = this
		, { ctx, key } = getRefContentValue(this.vnode)
	
	pos.start = codes.past
		? pos.max
		: target.selectionStart

	this.setValue(target.value)
	ctx[key] = this._modified

	if (!codes.delete) {
		const [s] = codes.backspace
			? h.findBackspaceIndex(this)
			: h.findNextAllowedIndex(this, true)

		pos.start = !codes.backspace
			? h.findLastNumberIndex(this) : s
	} else {
		pos.start = start >= max
			? max
			: pos.start += 1

		const [s] = h.findNextArrowRirghtIndex(this)
		pos.start = s
	}

	target.setSelectionRange(pos.start, pos.start)
}