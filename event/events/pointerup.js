export default function (e, h) {
	const { target } = e
		,	{ pos } = this

	// Без setTimeout не работает установка курсора в мобильном браузере
	setTimeout(() => {
		const [start, end] = h.isFullValue(this)
			? h.findAllowedIndex(this)
			: h.findFirstEmptyIndex(this)

		pos.start = start
		target.setSelectionRange(start, end)
	}, 20)
}