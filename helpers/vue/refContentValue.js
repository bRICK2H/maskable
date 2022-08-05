export default vnode => {
	const { data, context } = vnode
		, directive = data?.directives.find(curr => curr.name === 'maskable')

	if (directive) {
		const { expression } = directive
			, refValue = (ctx, key) => {
				return typeof ctx[key] === 'object'
					? refValue(ctx[key], String(Object.keys(ctx[key])))
					: { ctx, key }
			}
			, rootKey = expression
				.replace(/[^\w,]/g, '')
				.replace(/_/g, '')
				.split(',')
				.find(curr => context.hasOwnProperty(curr))

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