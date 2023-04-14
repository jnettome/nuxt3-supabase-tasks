import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import ptbr from 'dayjs/locale/pt-br.js'


export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(LocalizedFormat)
  dayjs.extend(relativeTime)
  dayjs.locale(ptbr)
  nuxtApp.provide('dayjs', dayjs)
})
// declare module '#app' {
//   interface NuxtApp {
//     $dayjs: dayjs.Dayjs
//   }
// }
// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $dayjs(date?: dayjs.ConfigType): dayjs.Dayjs
//   }
// }