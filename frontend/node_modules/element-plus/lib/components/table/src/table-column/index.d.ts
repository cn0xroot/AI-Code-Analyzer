import { UseTooltipProps } from "../../../tooltip/src/tooltip.js";
import { CheckboxProps, CheckboxValueType } from "../../../checkbox/src/checkbox.js";
import _default$1 from "../../../checkbox/src/checkbox-button.vue.js";
import _default$2 from "../../../checkbox/src/checkbox-group.vue.js";
import { TableColumnCtx } from "./defaults.js";
import { TableSortOrder } from "../table/defaults.js";
import * as _$vue from "vue";

//#region ../../packages/components/table/src/table-column/index.d.ts
declare const _default: _$vue.DefineComponent<_$vue.ExtractPropTypes<{
  type: {
    type: StringConstructor;
    default: string;
  };
  label: StringConstructor;
  className: StringConstructor;
  labelClassName: StringConstructor;
  property: StringConstructor;
  prop: StringConstructor;
  width: {
    type: (StringConstructor | NumberConstructor)[];
    default: string;
  };
  minWidth: {
    type: (StringConstructor | NumberConstructor)[];
    default: string;
  };
  renderHeader: _$vue.PropType<TableColumnCtx<any>["renderHeader"]>;
  sortable: {
    type: (BooleanConstructor | StringConstructor)[];
    default: boolean;
  };
  sortMethod: _$vue.PropType<TableColumnCtx<any>["sortMethod"]>;
  sortBy: _$vue.PropType<TableColumnCtx<any>["sortBy"]>;
  resizable: {
    type: BooleanConstructor;
    default: boolean;
  };
  columnKey: StringConstructor;
  align: StringConstructor;
  headerAlign: StringConstructor;
  showOverflowTooltip: {
    type: _$vue.PropType<TableColumnCtx<any>["showOverflowTooltip"]>;
    default: undefined;
  };
  tooltipFormatter: _$vue.PropType<TableColumnCtx<any>["tooltipFormatter"]>;
  fixed: (BooleanConstructor | StringConstructor)[];
  formatter: _$vue.PropType<TableColumnCtx<any>["formatter"]>;
  selectable: _$vue.PropType<TableColumnCtx<any>["selectable"]>;
  reserveSelection: BooleanConstructor;
  filterMethod: _$vue.PropType<TableColumnCtx<any>["filterMethod"]>;
  filteredValue: _$vue.PropType<TableColumnCtx<any>["filteredValue"]>;
  filters: _$vue.PropType<TableColumnCtx<any>["filters"]>;
  filterPlacement: StringConstructor;
  filterMultiple: {
    type: BooleanConstructor;
    default: boolean;
  };
  filterClassName: StringConstructor;
  index: _$vue.PropType<TableColumnCtx<any>["index"]>;
  sortOrders: {
    type: _$vue.PropType<TableColumnCtx<any>["sortOrders"]>;
    default: () => (string | null)[];
    validator: (val: TableColumnCtx<any>["sortOrders"]) => boolean;
  };
}>, void, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {}, string, _$vue.PublicProps, Readonly<_$vue.ExtractPropTypes<{
  type: {
    type: StringConstructor;
    default: string;
  };
  label: StringConstructor;
  className: StringConstructor;
  labelClassName: StringConstructor;
  property: StringConstructor;
  prop: StringConstructor;
  width: {
    type: (StringConstructor | NumberConstructor)[];
    default: string;
  };
  minWidth: {
    type: (StringConstructor | NumberConstructor)[];
    default: string;
  };
  renderHeader: _$vue.PropType<TableColumnCtx<any>["renderHeader"]>;
  sortable: {
    type: (BooleanConstructor | StringConstructor)[];
    default: boolean;
  };
  sortMethod: _$vue.PropType<TableColumnCtx<any>["sortMethod"]>;
  sortBy: _$vue.PropType<TableColumnCtx<any>["sortBy"]>;
  resizable: {
    type: BooleanConstructor;
    default: boolean;
  };
  columnKey: StringConstructor;
  align: StringConstructor;
  headerAlign: StringConstructor;
  showOverflowTooltip: {
    type: _$vue.PropType<TableColumnCtx<any>["showOverflowTooltip"]>;
    default: undefined;
  };
  tooltipFormatter: _$vue.PropType<TableColumnCtx<any>["tooltipFormatter"]>;
  fixed: (BooleanConstructor | StringConstructor)[];
  formatter: _$vue.PropType<TableColumnCtx<any>["formatter"]>;
  selectable: _$vue.PropType<TableColumnCtx<any>["selectable"]>;
  reserveSelection: BooleanConstructor;
  filterMethod: _$vue.PropType<TableColumnCtx<any>["filterMethod"]>;
  filteredValue: _$vue.PropType<TableColumnCtx<any>["filteredValue"]>;
  filters: _$vue.PropType<TableColumnCtx<any>["filters"]>;
  filterPlacement: StringConstructor;
  filterMultiple: {
    type: BooleanConstructor;
    default: boolean;
  };
  filterClassName: StringConstructor;
  index: _$vue.PropType<TableColumnCtx<any>["index"]>;
  sortOrders: {
    type: _$vue.PropType<TableColumnCtx<any>["sortOrders"]>;
    default: () => (string | null)[];
    validator: (val: TableColumnCtx<any>["sortOrders"]) => boolean;
  };
}>> & Readonly<{}>, {
  type: string;
  minWidth: string | number;
  width: string | number;
  resizable: boolean;
  showOverflowTooltip: boolean | Partial<Pick<UseTooltipProps, "offset" | "appendTo" | "effect" | "enterable" | "popperClass" | "placement" | "popperOptions" | "showArrow" | "transition" | "showAfter" | "hideAfter">> | undefined;
  sortOrders: (TableSortOrder | null)[];
  sortable: string | boolean;
  reserveSelection: boolean;
  filterMultiple: boolean;
}, {}, {
  ElCheckbox: {
    new (...args: any[]): _$vue.CreateComponentPublicInstanceWithMixins<Readonly<CheckboxProps> & Readonly<{
      "onUpdate:modelValue"?: ((val: CheckboxValueType) => any) | undefined;
      onChange?: ((val: CheckboxValueType) => any) | undefined;
    }>, {}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
      change: (val: CheckboxValueType) => void;
      "update:modelValue": (val: CheckboxValueType) => void;
    }, _$vue.PublicProps, {
      name: string;
      label: string | boolean | number | object;
      disabled: boolean;
      modelValue: number | string | boolean;
      id: string;
      validateEvent: boolean;
      value: string | boolean | number | object;
      trueValue: string | number;
      falseValue: string | number;
      trueLabel: string | number;
      falseLabel: string | number;
    }, false, {}, {}, _$vue.GlobalComponents, _$vue.GlobalDirectives, string, {}, any, _$vue.ComponentProvideOptions, {
      P: {};
      B: {};
      D: {};
      C: {};
      M: {};
      Defaults: {};
    }, Readonly<CheckboxProps> & Readonly<{
      "onUpdate:modelValue"?: ((val: CheckboxValueType) => any) | undefined;
      onChange?: ((val: CheckboxValueType) => any) | undefined;
    }>, {}, {}, {}, {}, {
      name: string;
      label: string | boolean | number | object;
      disabled: boolean;
      modelValue: number | string | boolean;
      id: string;
      validateEvent: boolean;
      value: string | boolean | number | object;
      trueValue: string | number;
      falseValue: string | number;
      trueLabel: string | number;
      falseLabel: string | number;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
  } & _$vue.ComponentOptionsBase<Readonly<CheckboxProps> & Readonly<{
    "onUpdate:modelValue"?: ((val: CheckboxValueType) => any) | undefined;
    onChange?: ((val: CheckboxValueType) => any) | undefined;
  }>, {}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
    change: (val: CheckboxValueType) => void;
    "update:modelValue": (val: CheckboxValueType) => void;
  }, string, {
    name: string;
    label: string | boolean | number | object;
    disabled: boolean;
    modelValue: number | string | boolean;
    id: string;
    validateEvent: boolean;
    value: string | boolean | number | object;
    trueValue: string | number;
    falseValue: string | number;
    trueLabel: string | number;
    falseLabel: string | number;
  }, {}, string, {}, _$vue.GlobalComponents, _$vue.GlobalDirectives, string, _$vue.ComponentProvideOptions> & _$vue.VNodeProps & _$vue.AllowedComponentProps & _$vue.ComponentCustomProps & (new () => {
    $slots: {
      default?: (props: {}) => any;
    };
  }) & _$vue.ObjectPlugin & {
    setPropsDefaults: (defaults: {
      readonly modelValue?: string | number | boolean | (() => string | number | boolean) | undefined;
      readonly label?: string | number | boolean | (() => string | number | boolean | object) | undefined;
      readonly value?: string | number | boolean | (() => string | number | boolean | object) | undefined;
      readonly indeterminate?: boolean | (() => boolean) | undefined;
      readonly disabled?: boolean | (() => boolean) | undefined;
      readonly checked?: boolean | (() => boolean) | undefined;
      readonly name?: string | (() => string) | undefined;
      readonly trueValue?: string | number | (() => string | number) | undefined;
      readonly falseValue?: string | number | (() => string | number) | undefined;
      readonly trueLabel?: string | number | (() => string | number) | undefined;
      readonly falseLabel?: string | number | (() => string | number) | undefined;
      readonly id?: string | (() => string) | undefined;
      readonly border?: boolean | (() => boolean) | undefined;
      readonly size?: "" | "default" | "small" | "large" | (() => "" | "default" | "small" | "large") | undefined;
      readonly tabindex?: string | number | (() => string | number) | undefined;
      readonly validateEvent?: boolean | (() => boolean) | undefined;
      readonly ariaLabel?: string | (() => string) | undefined;
      readonly ariaControls?: string | (() => string) | undefined;
    }) => void;
  } & {
    CheckboxButton: typeof _default$1;
    CheckboxGroup: typeof _default$2;
  };
}, {}, string, _$vue.ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };