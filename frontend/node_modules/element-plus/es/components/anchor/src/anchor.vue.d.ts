import { AnchorProps } from "./anchor.js";
import * as _$vue from "vue";

//#region ../../packages/components/anchor/src/anchor.vue.d.ts
declare var __VLS_1: {};
type __VLS_Slots = {} & {
  default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: _$vue.DefineComponent<AnchorProps, {
  scrollTo: (href?: string) => void;
}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
  change: (href: string) => void;
  click: (e: MouseEvent, href?: string | undefined) => void;
}, string, _$vue.PublicProps, Readonly<AnchorProps> & Readonly<{
  onChange?: ((href: string) => any) | undefined;
  onClick?: ((e: MouseEvent, href?: string | undefined) => any) | undefined;
}>, {
  type: "default" | "underline";
  offset: number;
  bound: number;
  duration: number;
  marker: boolean;
  direction: "vertical" | "horizontal";
}, {}, {}, {}, string, _$vue.ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
type __VLS_WithSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};
//#endregion
export { _default as default };