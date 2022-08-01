export default function (e) {
	const { clipboardData } = e
		, { codes } = this

	codes.past = true
	this.pastValue = clipboardData.getData('text')
}