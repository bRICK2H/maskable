import Maskable from './index'

export default {
	install(Vue) {
		Vue.directive('maskable', {
			bind(el, binding, vnode) {
				const { expression } = binding
				console.log(el, binding, vnode)
				const maskable = new Maskable({
					el,
					mask: expression
				})

				vnode.context.vv = maskable._value
			},

			componentUpdated(el, binding, vnode) {
				const { expression } = binding
				console.log(el, binding, vnode)
				const maskable = new Maskable({
					el,
					mask: expression
				})

				vnode.context.vv = maskable._value
			}
		})
	}
}