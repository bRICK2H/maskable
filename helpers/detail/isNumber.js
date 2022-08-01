export default v => {
	return !isNaN(+v) && /\d/.test(+v) && !isNaN(parseFloat(v))
}