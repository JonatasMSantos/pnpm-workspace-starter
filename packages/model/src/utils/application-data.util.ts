import moment from 'moment'

export default abstract class ApplicationDataUtil {
  public static fullDateFormat(requestDate: Date): string {
    //const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
    //const dayNamesShort = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
    //const dayNamesMin = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ]
    //const monthNamesShort = ['jan', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    //const dayOfWeek = requestDate.getDay()
    const day = requestDate.getDate()
    const month = requestDate.getMonth()
    const year = requestDate.getFullYear()

    return `São Paulo, ${day} de ${monthNames[month]} de ${year}`
  }

  public static isInsidePeriod(search: Date, initDate: Date, endDate: Date): boolean {
    var from = new Date(initDate.getFullYear(), initDate.getMonth(), initDate.getDate())
    var to = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

    var check = new Date(search.getFullYear(), search.getMonth() + 1, search.getDate())

    if (check.getTime() <= to.getTime() && check.getTime() >= from.getTime()) {
      return true
    } else {
      return false
    }
  }

  public static diffDays(date1: Date, date2: Date): any {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  public static firstDayOfCurrentMonth(): string {
    return moment().date(1).month(moment().month()).year(moment().year()).format('DD/MM/YYYY')
  }

  public static lastDayOfCurrentMonth(): any {
    const today = this.today()
    return new Date(today.getFullYear(), today.getMonth() + 1, 0)
  }

  public static format(date: any, format: string): string {
    return moment(date).format(format)
  }

  public static toDate(date: string, format: string): Date {
    return moment(date, format).toDate()
  }

  public static formatSQLDate(date: any, startDay: boolean, endDay: boolean): string {
    if (startDay) {
      return moment(date).format('YYYY-MM-DD') + ' 00:00:00'
    } else if (endDay) {
      return moment(date).format('YYYY-MM-DD') + ' 23:59:59'
    }

    return moment(date).format('YYYY-MM-DD hh-mm-ss')
  }

  public static addDays(startdate: any, addDays: number, fixedDay: number): Date {
    let nextDate = moment(startdate).add(addDays, 'days')
    nextDate = moment(nextDate)

    if (fixedDay) {
      let lastDayOf = nextDate.endOf('month').format('D')
      if (fixedDay > parseInt(lastDayOf)) {
        return moment(nextDate).set('date', parseInt(lastDayOf)).toDate()
      } else {
        return moment(nextDate).set('date', fixedDay).toDate()
      }
    } else {
      return nextDate.toDate()
    }
  }

  public static addMonth(startDate: Date, addMonth: number): Date {
    let start = moment(startDate)
    let fm = moment(startDate).add(addMonth, 'M')
    let fmEnd = moment(fm).endOf('month')
    let newDate = start.date() != fm.date() && fm.isSame(fmEnd.format('YYYY-MM-DD')) ? fm.add(1, 'd') : fm
    return newDate.toDate()
  }

  public static today(): Date {
    let data = new Date()
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000)
    return data2
  }

  public static isDate(s: string | number | Date): boolean {
    return !Number.isNaN(new Date(s).getTime())
  }

  public static yesterday(): Date {
    return moment().subtract(1, 'days').startOf('day').toDate()
  }

  public static isBefore(date1: Date, date2: Date): boolean {
    let d1 = this.format(date1, 'YYYYMMDD')
    let d2 = this.format(date2, 'YYYYMMDD')
    if (d1 == d2) {
      return false
    }

    return moment(d1).isBefore(d2)
  }

  public static isSame(date1: Date, date2: Date) {
    let d1 = this.format(date1, 'YYYYMMDD')
    let d2 = this.format(date2, 'YYYYMMDD')
    if (d1 == d2) {
      return true
    }

    return false
  }

  public static isAfter(date1: Date, date2: Date) {
    let d1 = this.format(date1, 'YYYYMMDD')
    let d2 = this.format(date2, 'YYYYMMDD')
    if (d1 == d2) {
      return false
    }

    return moment(d1).isAfter(d2)
  }

  public static excelDateToJSDate(date: number) {
    return new Date(Math.round((date - 25569) * 86400 * 1000))
  }

  constructor() {}
}
