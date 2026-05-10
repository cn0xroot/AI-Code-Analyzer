import { IconPropType } from "../../../utils/vue/icon.js";
import { PopperEffect } from "../../popper/src/popper.js";
import { TimeSelectProps } from "./time-select.js";
import * as _$vue from "vue";

//#region ../../packages/components/time-select/src/time-select.vue.d.ts
declare const __VLS_export: _$vue.DefineComponent<TimeSelectProps, {
  /**
   * @description blur the Input component
   */
  blur: () => void;
  /**
   * @description focus the Input component
   */
  focus: () => void;
}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
  clear: (...args: any[]) => void;
  "update:modelValue": (...args: any[]) => void;
  change: (...args: any[]) => void;
  focus: (...args: any[]) => void;
  blur: (...args: any[]) => void;
}, string, _$vue.PublicProps, Readonly<TimeSelectProps> & Readonly<{
  onClear?: ((...args: any[]) => any) | undefined;
  "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
  onChange?: ((...args: any[]) => any) | undefined;
  onFocus?: ((...args: any[]) => any) | undefined;
  onBlur?: ((...args: any[]) => any) | undefined;
}>, {
  disabled: boolean;
  effect: PopperEffect;
  clearable: boolean;
  clearIcon: IconPropType;
  prefixIcon: IconPropType;
  end: string;
  start: string;
  popperClass: string;
  popperStyle: string | _$vue.CSSProperties;
  format: string;
  valueOnClear: string | number | boolean | Function | null;
  step: string;
  editable: boolean;
}, {}, {}, {}, string, _$vue.ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
//#endregion
export { _default as default };