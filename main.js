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
				
				el.value = maskable._value
				changeVModel(value, maskable, vnode)
				maskable.prevModified = maskable.modified
			},
		})
	}
}