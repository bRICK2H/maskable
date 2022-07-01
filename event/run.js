import h from '../helpers'

export default function (isCapture, e) {
	const { type } = e
	,	{
		default: event
	} = require(`./events/${type}.js`)

	event.call(this, e, h, isCapture)
}