//#region ../../packages/components/time-select/src/utils.d.ts
interface Time {
  hours: number;
  minutes: number;
}
declare const parseTime: (time: string) => null | Time;
declare const compareTime: (time1: string, time2: string) => number;
declare const padTime: (time: number | string) => string;
declare const formatTime: (time: Time) => string;
declare const nextTime: (time: string, step: string) => string;
//#endregion
export { compareTime, formatTime, nextTime, padTime, parseTime };