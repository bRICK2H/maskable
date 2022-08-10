import Maskable from './index'

const getMaskOptions = (el, vnode, value) => {
	return typeof value === 'object'
		? { ...value, vnode, el }
		: { mask: value, el }
}

export default {

	install(Vue) {
		Vue.directive('maskable', {
			async bind(el, binding, vnode) {
				const { value } = binding

				if (!value || !value.mask) return

				new Maskable(
					getMaskOptions(el, vnode, value)
				)
			}
		})

	}

}