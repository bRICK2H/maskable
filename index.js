/**
 * mask type:
 * 1. phone (___)  ___-__-__ (10)
 * 2. date __.__.____ (8)
 * 3. time __:__ (4)
 */
import eventRegister from './event/register'
// import setTime from './values/time'
import setTime2 from './values/time2'
import setDate from './values/date'
import setPhone from './values/phone'

export default class Maskable {
	constructor (options = {}) {
		const { el } = options
		
		this.mask = ''
		this.char = '_'
		this.value = ''
		this.modified = ''
		this.type = null
		this.node = null
		this.isLoad = false
		this.modify = false
		this.pos = {
			start: 0,
			min: 0,
			max: 0
		}
		this.codes = {
			backspace: false,
		}

		el instanceof Node
			? this.init(options)
			: setTimeout(() => this.init(options))
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
			modify = false,
		} = options

		this.node = this.getInputNode(el)
		this.modify = modify

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
				if (curr !== '' && /\D/.test(curr)) {
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
			// case 4: setTime(options)
			case 4: setTime2(options)
				break

			case 8: setDate(options)
				break
			
			case 10: setPhone(options)
				break

		}

		this.isLoad = true

	}
	
}