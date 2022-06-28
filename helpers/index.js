const isFullValue = ctx => {
	const { char, value } = ctx

	return value.indexOf(char) === -1
}

const findFirstEmpty = ctx => {
	const {
		char,
		value,
	} = ctx

	const index = value.indexOf(char)
	
	return [index, index]
}

export default {
	isFullValue,
	findFirstEmpty,
}