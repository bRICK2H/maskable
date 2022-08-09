import Maskable from './index'

const getMaskOptions = (el, vnode, value) => {
	return typeof value === 'object'
		? { ...value, vnode, el }
		: { mask: value, el }
}

export default {

	install(Vue) {
		Vue.directive('maskable', {
			bind(el, binding, vnode) {
				const { value } = binding

				new Maskable(
					getMaskOptions(el, vnode, value)
				)
			}
		})

	}

}