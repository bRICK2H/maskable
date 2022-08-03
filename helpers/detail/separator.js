export default (char, value) => {
	const pattern = new RegExp(`[\\d${char} ]`, 'g')

	return value.replace(pattern, '').slice(0, 1)
}