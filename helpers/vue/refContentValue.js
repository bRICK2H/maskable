export default vnode => {
	const { data, context } = vnode
		, directive = data?.directives.find(curr => curr.name === 'maskable')

	if (directive) {
		const { value } = directive
			, ignored = ['mask', 'char', 'isModified', 'awaitFocus']
			, refValue = (ctx, key) => {
				return typeof ctx[key] === 'object'
					? refValue(ctx[key], String(Object.keys(ctx[key])))
					: { ctx, key }
			}
			, rootKey = Object.keys(value)
				.filter(curr => !ignored.includes(curr))
				.find(curr => curr in context)

		if (rootKey) {
			const { ctx, key } = refValue(context, rootKey)

			return {
				ctx,
				key,
				rootKey,
				rootCtx: context,
				rootValue: context[rootKey],
			}
		}

		return null
	}
}