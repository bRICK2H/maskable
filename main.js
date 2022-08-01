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

export default {
	install(Vue) {
		Vue.directive('maskable', {
			bind(el, binding, vnode) {
				const { value } = binding
					,	{ data, context } = vnode
					, 	{ immediate = true } = value
					, 	vModel = data?.directives.find(({ name }) => name === 'model')
					
				maskable = new Maskable(getMaskOptions(el, value))

				if (vModel && immediate) {
					const { expression } = vModel
						,	vValNames = expression.split('.')
						,	vPropName = vValNames[vValNames.length - 1]
						,	vObjectReference = vValNames
								.reduce((acc, dir) => {
									return typeof acc[dir] === 'object' && acc[dir] !== null
										? acc[dir] : acc
								}, context)
						
					vObjectReference[vPropName] = String(maskable._modified)
					setGetters(maskable, value)
				}
			},

			componentUpdated(el, binding) {
				const { value } = binding
				
				setGetters(maskable, value)
				
				el.value = maskable._value
				maskable.prevModified = maskable.modified
			},
		})
	}
}