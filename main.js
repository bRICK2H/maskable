import Maskable from './index'

let maskable = {}

const getMaskOptions = (el, value) => {
	return typeof value === 'object'
		? { ...value, el }
		: { mask: value, el }
}

const setGetters = (maskable, value) => {
	if (typeof value === 'object') {
		value.getters = {
			value: maskable._value,
			modified: maskable._modified
		}
	}
}

const changeVModel = (value, maskable, vnode) => {
	const { data, context } = vnode
		, vModel = data?.directives.find(({ name }) => name === 'model')

	if (vModel) {
		const { expression } = vModel
			, vValNames = expression.split('.')
			, vPropName = vValNames[vValNames.length - 1]
			, vObjectReference = vValNames
				.reduce((acc, dir) => {
					return typeof acc[dir] === 'object' && acc[dir] !== null
						? acc[dir] : acc
				}, context)

		setGetters(maskable, value)
		vObjectReference[vPropName] = maskable._modified
	}
}

const inputValue = (vnode, maskable) => {
	const { data, context } = vnode
		, vMaskable = data?.directives.find(({ name }) => name === 'maskable')

	if (vMaskable) {
		console.log('vMaskable', vMaskable)
		const { expression } = vMaskable
			, refValue = (ctx, key) => {
				return typeof ctx[key] === 'object'
					? refValue(ctx[key], String(Object.keys(ctx[key])))
					: { ctx, key }
			}
			, str = expression.replace(/[\n\t\{\}]/g, '')
			, arrayExpression = str.split(',').reduce((acc, curr) => {
				const [key, value] = curr.split(':')
				acc[key] = value.replace(/[ ']/g, '')

				return acc
			}, {})

		if (arrayExpression['content']) {
			const root = arrayExpression['content']
				, { ctx, key } = refValue(context, root)

			console.log(arrayExpression, ctx, key)

			// if (!e) {
			// 	return ctx[key]
			// } else {
			// 	ctx[key] = +e.target.value
			// }

			ctx[key] = maskable._modified
		}
	}
}

const getRefContentValue = (vnode) => {
	const { data, context } = vnode
		, vMaskable = data?.directives.find(({ name }) => name === 'maskable')

	if (vMaskable) {
		const { expression } = vMaskable
			, refValue = (ctx, key) => {
				return typeof ctx[key] === 'object'
					? refValue(ctx[key], String(Object.keys(ctx[key])))
					: { ctx, key }
			}
			, str = expression.replace(/[\n\t\{\}]/g, '')
			, arrayExpression = str.split(',').reduce((acc, curr) => {
				const [key, value] = curr.split(':')
				acc[key] = value.replace(/[ ']/g, '')

				return acc
			}, {})

		if (arrayExpression['content']) {
			const root = arrayExpression['content']
				, { ctx, key } = refValue(context, root)

			return { ctx, key }
		}

		return null
	}
}

export default {
	install(Vue) {
		Vue.directive('maskable', {
			bind(el, binding, vnode) {
				const { value } = binding
					
				maskable = new Maskable(getMaskOptions(el, value))
				changeVModel(value, maskable, vnode)
			},

			componentUpdated(el, binding, vnode) {
				const { value } = binding

				changeVModel(value, maskable, vnode)

				el.value = maskable._value
				maskable.prevModified = maskable.modified
			},
		})
	}
}