import h from '../helpers'

export default function (e) {
	const { type } = e
		,	{
			[type]: event
		} = require(`./events/${type}.js`)

	event.call(this, e, h)
}