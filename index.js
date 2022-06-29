/**
 * mask type:
 * 1. phone (___)  ___-__-__ (10)
 * 2. date __.__.____ (8)
 * 3. time __:__ (4)
 */
import eventRegister from './event/register'

export default class Maskable {
	constructor (options = {}) {
		this.mask = ''
		this.char = '_'
		this.value = ''
		this.type = null
		this.node = null
		this.pos = {
			min: 0,
			max: 0
		}
		this.codes = {
			backspace: false,
		}

		this.init(options)
	}

	get _value() {
		return this.value
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

		// setTimeout(() => {
			this.node = this.getInputNode(el)
	
			if (!this.node) {
				console.warn('[Maskable]: Элемент узла не найден.')
			} else {
				this.initMask({ mask, char })
			}
		// })
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

	initMask({ mask, char }) {
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
		mask = mask.replace(/[\'\`]/g, '')

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
		const { 
			type, mask, char, node,
		} = this

		switch (type) {
			// Phone
			case 10: {
				value = value
					.replace(/\+7/, '')
					.replace(/\D/g, '')

				if (value.length >= 11) {
					value = value.slice(0, -1)
				}
			}
				break
		}

		value = value.split('')

		const finallyValue = mask
			.split('')
			.map(el => {
				if (el === char) {
					return value.length
						? value.splice(0, 1)
						: char
				}

				return el
			})
			.join('')

		node.value = this.value = finallyValue
		
	}
}