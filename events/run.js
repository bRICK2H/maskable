import f from './helpers'

export default function (e) {
	require(`./list/${e.type}.js`)
		.default.call(this, e, f)
}