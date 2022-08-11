import setTime from './values/time'
import setDate from './values/date'
import setPhone from './values/phone'
import eventRegister from './event/register'
import getRefContentValue from './helpers/vue/refContentValue'

export default class Maskable {
	constructor(options = {}) {
		const { el } = options

		this.mask = ''
		this.char = '_'
		this.value = ''
		this.prevValue = ''
		this.pastValue = ''
		this.vueRefContentValue = null
		this.modified = ''
		this.prevModified = ''
		this.validCounter = 0
		this.isSystemIndex = false
		this.isTargetFocus = false
		this.type = null
		this.node = null
		this.isLoad = false
		this.pos = {
			min: 0,
			max: 0,
			end: 0,
			start: 0,
			block: false
		}
		this.codes = {
			arrow: null,
			past: false,
			shift: false,
			delete: false,
			control: false,
			touchmove: false,
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
	async init(options) {
		const {
			el = null,
			mask = '',
			char = '_',
			vnode = {},
			awaitFocus = false,
			isModified = true
		} = options

		this.isModified = isModified
		this.node = this.getInputNode(el)
		this.vueRefContentValue = getRefContentValue(vnode)

		if (this.vueRefContentValue) {
			const {
				ctx, key
			} = this.vueRefContentValue

			if (ctx[key]) {
				el.value = ctx[key]
			} else {
				if (awaitFocus) {
					const listener = r => r(true)
					el.placeholder = mask
					await new Promise(r => el.addEventListener('focus', () => listener(r)))
				}
			}
		}

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
				.map(([, arr]) => arr.length)
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
		this.prevValue = this._value

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

		if (this.vueRefContentValue) {
			const {
				ctx,
				key,
				rootCtx,
				rootKey,
				rootValue
			} = this.vueRefContentValue

			ctx[key] = this.isModified
				? this._modified
				: this._value

			if (typeof rootValue === 'object' && rootValue !== null) {
				rootCtx[rootKey] = JSON.parse(JSON.stringify(rootValue))
			}
		}

		this.isLoad = true
	}

}