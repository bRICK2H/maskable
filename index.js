/**
 * mask type:
 * 1. phone (___)  ___-__-__ (10)
 * 2. date __.__.____ (8)
 * 3. time __:__ (4)
 */
import eventRegister from './events/register'

export default class Maskable {
	constructor (options = {}) {
		this.mask = ''
		this.char = '_'
		this.type = null
		this.node = null
		this.pos = {
			min: 0,
			max: 0
		}

		this.init(options)
	}
	
	/**
	 * Инициализация плагина
	 * @param { Object } options 
	 */
	init(options) {
		console.log('init')
		const {
			el = null,
			mask = '',
			char = '_',
			moving = false,
		} = options

		setTimeout(() => {
			this.node = this.getInputNode(el)
			console.log(mask)
	
			if (!this.node) {
				console.warn('[Maskable]: Элемент узла не найден.')
			} else {
				this.initMask({ mask, char })
	
				/**
				 * 1. Определение маски
				 * 2. Если маска указана:
				 * 	Определенить тип маски
				 * 	Определить символы маски в зависимости от свойства char
				 */
			}
		})
	}

	/**
	 * Получить/определить узел input 
	 * @param { String } el 
	 * @returns node
	 */

	getInputNode(el) {
		return document.querySelector(el)
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
			this.pos.min = this.mask.indexOf(this.char)
			this.pos.max = this.mask.lastIndexOf(this.char)
			this.node.value = mask

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

		// Определить тип маски (пока что напишу общие действия для всего)

		return isExistChar
			? mask
			: mask.replace(pattern, char)
	}
}