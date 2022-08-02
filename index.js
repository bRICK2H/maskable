import eventRegister from './event/register'
import setTime from './values/time'
import setDate from './values/date'
import setPhone from './values/phone'

export default class Maskable {
	constructor (options = {}) {
		const { el } = options
		
		this.mask = ''
		this.char = '_'
		this.value = ''
		this.prevValue = ''
		this.pastValue = ''
		this.modified = ''
		this.prevModified = ''
		this.validCounter = 0
		this.type = null
		this.node = null
		this.isLoad = false
		this.pos = {
			min: 0,
			max: 0,
			end: 0,
			start: 0,
		}
		this.codes = {
			past: false,
			shift: false,
			control: false,
			backspace: false,
		}

		el instanceof Node
			? this.init(options)
			: setTimeout(() => this.init(options))
	}

	set _validCounter(value) {
		this.validCounter = value
	}
	
	get _validCounter() {
		return this.validCounter
	}
	
	get _value() {
		return this.value
	}

	get _modified() {
		return this.modified
	}

	/**
	 * Инициализация плагина
	 * @param { Object } options 
	 */
	init(options) {
		const {
			el = null,
			mask = '',
			char = '_',
		} = options

		this.node = this.getInputNode(el)

		if (!this.node) {
			console.warn('[Maskable]: Элемент узла не найден.')
		} else {
			this.initProperty({ mask, char })
		}
	}

	/**
	 * Получить/определить узел input 
	 * @param { String } el 
	 * @returns node
	 */

	getInputNode(el) {
		return el instanceof Node ? el : document.querySelector(el)
	}

	/**
	 * Инициализация маски
	 * @param { Ojbect } options
	 */

	initProperty({ mask, char }) {
		char = char.replace(/ /g, '')

		if (!mask) {
			console.warn('[Maskable]: Не указан тип маски.')
		} else {
			this.char = this.getChar(char)
			this.mask = this.getMask({ mask, char: this.char })
			this.type = this.getType()
			this.pos.min = this.mask.indexOf(this.char)
			this.pos.max = this.mask.lastIndexOf(this.char) + 1

			this.setValue(this.node.value)

			// Регистрация собитий
			eventRegister(this)
		}
	}

	/**
	 * Получить/определить символы маски
	 * @param { String } char 
	 * @returns String char
	 */

	getChar(char) {
		if (!char) {
			return this.char
		} else {
			const isSymbol = (/\W/.test(char) || char === this.char)

			return isSymbol ? char : this.char
		}
	}

	getMask({ mask, char }) {
		const symbols = mask
			.replace(/ /g, '')
			.split('')
			.reduce((acc, curr) => {
				if (curr !== '' && /\D/.test(+curr)) {
					acc[curr] = acc[curr]
						? [...acc[curr], curr]
						: [curr]
				}

				return acc
			}, {})
		const maxLen = Math.max(
			...Object
				.entries(symbols)
				.map(([_, arr]) => arr.length)
		)
		const charSymbol = Object
			.entries(symbols)
			.reduce((acc, [char, arr]) => {
				if (arr.length === maxLen) {
					acc = char
				}

				return acc
			}, '')
		const isExistChar = charSymbol === char
		const pattern = new RegExp(`${charSymbol}`, 'g')

		return isExistChar
			? mask
			: mask.replace(pattern, char)
	}

	/**
	 * Определить/получить тип маски
	 * @returns Number
	 */

	getType() {
		const {
			mask, char
		} = this

		return mask
			.split('')
			.filter(el => el === char)
			.length
	}

	/**
	 * Установить новое значение для input
	 * @param { String } value 
	 */

	setValue(value) {
		const { type } = this
		, options = { ctx: this, value }

		switch (type) {
			case 4: setTime(options)
				break

			case 8: setDate(options)
				break
			
			case 10: setPhone(options)
				break

		}

		this.isLoad = true
		this.prevValue = this.value
	}
	
}