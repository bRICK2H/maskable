import formatMask from '../helpers/mask'

const formatPhone = value => {
	return value.replace(/[^\+7\d]/g, '')
}

export default ({ ctx, value }) => {
	const { node } = ctx

	const maskValue = formatMask(ctx, value)
		,	modifyValue = formatPhone(maskValue)

	node.value =
	ctx.value = maskValue
	ctx.modified = modifyValue
}