import 'reflect-metadata'
const numeroPorExtenso = require('numero-por-extenso')

import ApplicationDataUtil from './application-data.util'

export default abstract class ApplicationUtil {
  /**
   *
   * @param string
   * @param search
   * @param replace
   * @returns
   */
  public static replaceAll(string: any, search: any, replace: any) {
    return string.split(search).join(replace)
  }

  public static removeAccent(text: string): string {
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c')
    return text
  }

  public static valueWrittenInFull(valor: any): string {
    return numeroPorExtenso.porExtenso(valor, numeroPorExtenso.estilo.monetario)
  }

  public static capitalizeAllWords(str: string): string {
    return str.replace(/\b\w/g, function (l) {
      return l.toUpperCase()
    })
  }

  public static camelCaseKeysObject(object: any): any {
    return Object.entries(object).reduce((carry: any, [key, value]) => {
      let v = value
      if (typeof object[key] === 'object') {
        v = this.camelCaseKeysObject(object[key])
      }

      carry[this.camelize(key)] = v

      return carry
    }, {})
  }

  public static camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, '')
  }

  public static capitalizeFirstLetter(str: string): any {
    if (!str) {
      return null
    }
    let splitStr = str.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
  }

  public static formatMoneyBR(valor: number): string {
    if (!valor) {
      return ''
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  public static isNullOrEmpty(object: any): boolean {
    return object == null || object.length === 0
  }

  public static isEmpty(obj: any): boolean {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
  }

  public static toPlainObject(lista: any): any {
    const objetos = []
    for (const obj of lista) {
      let json: any = {}
      for (const key in obj) {
        // obtém as chaves do objeto
        // se o valor for diferente de objeto (caso events)
        if (obj[key] && obj[key].constructor === Array) {
          obj[key].forEach((item: any) => {
            for (const key2 in item) {
              if (obj[key2]) {
                json = this.getObject(obj, key, json)
              }
            }
          })
        } else {
          json = this.getObject(obj, key, json)
        }
      }
      objetos.push(json)
    }
    return objetos
  }

  public static getObject(obj: any, key: any, json: any): any {
    if (typeof obj[key] !== 'object') {
      json[key] = obj[key]
    } else {
      Object.keys(obj[key]).forEach((key2) => {
        if (typeof obj[key][key2] !== 'object') {
          if (key2) {
            if (obj[key][key2] instanceof Date || key2.includes('data')) {
              json[key2] = obj[key][key2]
              json[key2] = ApplicationDataUtil.format(obj[key][key2], 'MM/DD/YYYY')
            } else if (typeof obj[key][key2] === 'boolean' && key2 === 'visivel') {
              // json[key + '_' + key2] = obj[key][key2];
            } else {
              json[key + '_' + key2] = obj[key][key2]
            }
          }
        } else {
          json = ApplicationUtil.getObject(obj[key], key2, json)
        }
      })
    }
    return json
  }

  public static age(dataNascimento: Date): number {
    let anoAniversario = dataNascimento.getUTCFullYear()
    let mesAniversario = dataNascimento.getUTCMonth() + 1
    let diaAniversario = dataNascimento.getUTCDate()

    const d = ApplicationDataUtil.today()
    const anoAtual = d.getFullYear()
    const mesAtual = d.getMonth() + 1
    const diaAtual = d.getDate()
    ;(anoAniversario = +anoAniversario), (mesAniversario = +mesAniversario), (diaAniversario = +diaAniversario)

    let quantosAnos = anoAtual - anoAniversario

    if (mesAtual < mesAniversario || (mesAtual === mesAniversario && diaAtual < diaAniversario)) {
      quantosAnos--
    }

    return quantosAnos < 0 ? 0 : quantosAnos
  }

  public static validateCPF(cpf: string): boolean {
    const inputCPF: string = this.onlyNumbers(cpf)

    const regexTodosNumerosIguais = /^(\d)\1+$/
    if (regexTodosNumerosIguais.test(inputCPF)) {
      return false
    }

    let soma = 0
    let resto

    if (inputCPF === '00000000000') {
      return false
    }
    // tslint:disable-next-line: radix
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i)
    }
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) {
      resto = 0
    }
    // tslint:disable-next-line: radix
    if (resto !== parseInt(inputCPF.substring(9, 10))) {
      return false
    }

    soma = 0
    // tslint:disable-next-line: radix
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i)
    }
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) {
      resto = 0
    }
    // tslint:disable-next-line: radix
    if (resto !== parseInt(inputCPF.substring(10, 11))) {
      return false
    }
    return true
  }

  public static onlyNumbers(num: any): any {
    return num.replace(/[^\d]+/g, '')
  }

  static async sleep(milisegundo: any): Promise<any> {
    await this.promiseSleep(milisegundo)
  }

  static async promiseSleep(msec: any): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, msec))
  }

  public static validateFirstLastName(nome: string): boolean {
    return nome ? nome.split(' ').length > 1 : false
  }

  public static countChars(char: string, texto: string): number {
    return texto ? texto.split(char).length - 1 : 0
  }

  public static number(valor: any) {
    return valor ? valor : 0
  }

  public static getDecorators(target: any, propertyName: string | symbol): string[] {
    // get info about keys that used in current property
    const keys: any[] = Reflect.getMetadataKeys(target, propertyName)
    const decorators = keys
      // filter your custom decorators
      .filter((key) => key.toString().startsWith('custom:anotations'))
      .reduce((values, key) => {
        // get metadata value.
        const currValues = Reflect.getMetadata(key, target, propertyName)
        return values.concat(currValues)
      }, [])

    return decorators
  }

  public static sanitizeClass(object: any, objectReference: any) {
    if (!object) {
      return
    }
    object = JSON.parse(JSON.stringify(object))

    if (!objectReference) {
      objectReference = object
    }

    for (let props in objectReference) {
      let normalCase: boolean = false
      let decorators = ApplicationUtil.getDecorators(objectReference, props)
      if (decorators && decorators.length >= 1) {
        for (let i = 0; i < decorators.length; i++) {
          const decorator = decorators[i]
          if (decorator == 'Transient') {
            delete object[props]
          }

          if (decorator == 'NormalCase') {
            normalCase = true
          }
        }
      }

      if (typeof object[props] === 'string' && !normalCase) {
        if (object[props]) {
          object[props] = object[props].toUpperCase()
        }
      }
    }
    return object
  }

  public static copyEntity(entity: any, entityValues: any): any {
    for (let props in entity) {
      entity[props] = entityValues[props]
    }
    return entity
  }

  public static round(value: number): number {
    try {
      return +value.toFixed(2)
    } catch (e) {
      return value
    }
  }

  public static getFromBetween(str: string, between: string) {
    var replace = ApplicationUtil.replaceAll(str, between, '{')

    var values = replace.match(/\{(.*?)\{/g)
    if (!values) {
      return null
    }

    values = values.map((v: string) => {
      return ApplicationUtil.replaceAll(v, '{', '')
    })

    return values
  }
}
