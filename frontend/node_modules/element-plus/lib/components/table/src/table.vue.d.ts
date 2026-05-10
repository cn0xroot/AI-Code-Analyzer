import { SFCWithInstall } from "../../../utils/vue/typescript.js";
import { EpPropMergeType } from "../../../utils/vue/props/types.js";
import { Translator } from "../../../hooks/use-locale/index.js";
import { UseTooltipProps } from "../../tooltip/src/tooltip.js";
import { CheckboxProps, CheckboxValueType } from "../../checkbox/src/checkbox.js";
import _default$1 from "../../checkbox/src/checkbox-button.vue.js";
import _default$2 from "../../checkbox/src/checkbox-group.vue.js";
import { TableColumnCtx } from "./table-column/defaults.js";
import { TableHeaderProps } from "./table-header/index.js";
import TableLayout from "./table-layout.js";
import { DefaultRow, Filter, RenderExpanded, Sort, Table, TableProps, TableSortOrder, TreeProps } from "./table/defaults.js";
import { StoreFilter } from "./store/index.js";
import { TreeData } from "./store/tree.js";
import { TableBodyProps } from "./table-body/defaults.js";
import { TableFooter } from "./table-footer/index.js";
import { MousewheelCallback, WheelElement } from "../../../directives/mousewheel/index.js";
import { hColgroup } from "./h-helper.js";
import { ScrollbarDirection, ScrollbarProps } from "../../scrollbar/src/scrollbar.js";
import * as _$vue from "vue";
import * as _$lodash_unified0 from "lodash-unified";

//#region ../../packages/components/table/src/table.vue.d.ts
declare const _default: typeof __VLS_export;
declare const __VLS_export: _$vue.DefineComponent<_$vue.ExtractPropTypes<{
  data: {
    type: _$vue.PropType<any[]>;
    default: () => never[];
  };
  size: {
    readonly type: _$vue.PropType<EpPropMergeType<StringConstructor, "" | "default" | "small" | "large", never>>;
    readonly required: false;
    readonly validator: ((val: unknown) => boolean) | undefined;
    __epPropKey: true;
  };
  width: (StringConstructor | NumberConstructor)[];
  height: (StringConstructor | NumberConstructor)[];
  maxHeight: (StringConstructor | NumberConstructor)[];
  fit: {
    type: BooleanConstructor;
    default: boolean;
  };
  stripe: BooleanConstructor;
  border: BooleanConstructor;
  rowKey: _$vue.PropType<TableProps<any>["rowKey"]>;
  showHeader: {
    type: BooleanConstructor;
    default: boolean;
  };
  showSummary: BooleanConstructor;
  sumText: StringConstructor;
  summaryMethod: _$vue.PropType<TableProps<any>["summaryMethod"]>;
  rowClassName: _$vue.PropType<TableProps<any>["rowClassName"]>;
  rowStyle: _$vue.PropType<TableProps<any>["rowStyle"]>;
  cellClassName: _$vue.PropType<TableProps<any>["cellClassName"]>;
  cellStyle: _$vue.PropType<TableProps<any>["cellStyle"]>;
  headerRowClassName: _$vue.PropType<TableProps<any>["headerRowClassName"]>;
  headerRowStyle: _$vue.PropType<TableProps<any>["headerRowStyle"]>;
  headerCellClassName: _$vue.PropType<TableProps<any>["headerCellClassName"]>;
  headerCellStyle: _$vue.PropType<TableProps<any>["headerCellStyle"]>;
  highlightCurrentRow: BooleanConstructor;
  currentRowKey: (StringConstructor | NumberConstructor)[];
  emptyText: StringConstructor;
  expandRowKeys: _$vue.PropType<TableProps<any>["expandRowKeys"]>;
  defaultExpandAll: BooleanConstructor;
  rowExpandable: {
    type: _$vue.PropType<TableProps<any>["rowExpandable"]>;
  };
  defaultSort: _$vue.PropType<TableProps<any>["defaultSort"]>;
  tooltipEffect: StringConstructor;
  tooltipOptions: _$vue.PropType<TableProps<any>["tooltipOptions"]>;
  spanMethod: _$vue.PropType<TableProps<any>["spanMethod"]>;
  selectOnIndeterminate: {
    type: BooleanConstructor;
    default: boolean;
  };
  indent: {
    type: NumberConstructor;
    default: number;
  };
  treeProps: {
    type: _$vue.PropType<TableProps<any>["treeProps"]>;
    default: () => {
      hasChildren: string;
      children: string;
      checkStrictly: boolean;
    };
  };
  lazy: BooleanConstructor;
  load: _$vue.PropType<TableProps<any>["load"]>;
  style: {
    type: _$vue.PropType<TableProps<any>["style"]>;
    default: () => {};
  };
  className: {
    type: StringConstructor;
    default: string;
  };
  tableLayout: {
    type: _$vue.PropType<"fixed" | "auto">;
    default: string;
  };
  scrollbarAlwaysOn: BooleanConstructor;
  flexible: BooleanConstructor;
  showOverflowTooltip: {
    type: _$vue.PropType<TableProps<any>["showOverflowTooltip"]>;
    default: undefined;
  };
  tooltipFormatter: _$vue.PropType<TableProps<any>["tooltipFormatter"]>;
  appendFilterPanelTo: StringConstructor;
  scrollbarTabindex: {
    type: (StringConstructor | NumberConstructor)[];
    default: undefined;
  };
  allowDragLastColumn: {
    type: BooleanConstructor;
    default: boolean;
  };
  preserveExpandedContent: BooleanConstructor;
  nativeScrollbar: BooleanConstructor;
}>, {
  ns: {
    namespace: _$vue.ComputedRef<string>;
    b: (blockSuffix?: string) => string;
    e: (element?: string) => string;
    m: (modifier?: string) => string;
    be: (blockSuffix?: string, element?: string) => string;
    em: (element?: string, modifier?: string) => string;
    bm: (blockSuffix?: string, modifier?: string) => string;
    bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
    is: {
      (name: string, state: boolean | undefined): string;
      (name: string): string;
    };
    cssVar: (object: Record<string, string>) => Record<string, string>;
    cssVarName: (name: string) => string;
    cssVarBlock: (object: Record<string, string>) => Record<string, string>;
    cssVarBlockName: (name: string) => string;
  };
  layout: TableLayout<any>;
  store: {
    mutations: {
      setData(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, data: any[]): void;
      insertColumn(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, column: TableColumnCtx<any>, parent: TableColumnCtx<any>, updateColumnOrder: () => void): void;
      updateColumnOrder(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, column: TableColumnCtx<any>): void;
      removeColumn(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, column: TableColumnCtx<any>, parent: TableColumnCtx<any>, updateColumnOrder: () => void): void;
      sort(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, options: Sort): void;
      changeSortCondition(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, options: Sort): void;
      filterChange(_states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, options: Filter<any>): void;
      toggleAllSelection(): void;
      rowSelectedChanged(_states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, row: any): void;
      setHoverRow(states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, row: any): void;
      setCurrentRow(_states: {
        _currentRowKey: _$vue.Ref<string | null, string | null>;
        currentRow: _$vue.Ref<any, any>;
        expandRowKeys: _$vue.Ref<string[], string[]>;
        treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
        indent: _$vue.Ref<number, number>;
        lazy: _$vue.Ref<boolean, boolean>;
        lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
        lazyColumnIdentifier: _$vue.Ref<string, string>;
        childrenColumnName: _$vue.Ref<string, string>;
        checkStrictly: _$vue.Ref<boolean, boolean>;
        expandRows: _$vue.Ref<any[], any[]>;
        defaultExpandAll: _$vue.Ref<boolean, boolean>;
        tableSize: _$vue.Ref<any, any>;
        rowKey: _$vue.Ref<string | null, string | null>;
        data: _$vue.Ref<any[], any[]>;
        _data: _$vue.Ref<any[], any[]>;
        isComplex: _$vue.Ref<boolean, boolean>;
        _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
        updateOrderFns: (() => void)[];
        leafColumnsLength: _$vue.Ref<number, number>;
        fixedLeafColumnsLength: _$vue.Ref<number, number>;
        rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
        isAllSelected: _$vue.Ref<boolean, boolean>;
        selection: _$vue.Ref<any[], any[]>;
        selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
        reserveSelection: _$vue.Ref<boolean, boolean>;
        selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
        selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
        filters: _$vue.Ref<StoreFilter, StoreFilter>;
        filteredData: _$vue.Ref<any[] | null, any[] | null>;
        sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
        sortProp: _$vue.Ref<string | null, string | null>;
        sortOrder: _$vue.Ref<string | number | null, string | number | null>;
        hoverRow: _$vue.Ref<any, any>;
      }, row: any): void;
    };
    commit: (name: "sort" | "setData" | "insertColumn" | "updateColumnOrder" | "removeColumn" | "changeSortCondition" | "filterChange" | "toggleAllSelection" | "rowSelectedChanged" | "setHoverRow" | "setCurrentRow", ...args: any[]) => void;
    updateTableScrollY: () => void;
    assertRowKey: () => void;
    updateColumns: () => void;
    scheduleLayout: (needUpdateColumns?: boolean, immediate?: boolean) => void;
    isSelected: (row: any) => boolean;
    clearSelection: () => void;
    cleanSelection: () => void;
    getSelectionRows: () => any[];
    toggleRowSelection: (row: any, selected?: boolean, emitChange?: boolean, ignoreSelectable?: boolean) => void;
    _toggleAllSelection: () => void;
    toggleAllSelection: (() => void) | null;
    updateAllSelected: () => void;
    updateSelectionByChildren: (options?: {
      emitChange?: boolean;
      rowIndexMap?: Map<string, number>;
    }) => void;
    getRowIndeterminate: (row: any) => boolean;
    updateFilters: (column: TableColumnCtx<any>, values: string[]) => Record<string, string[]>;
    updateCurrentRow: (_currentRow: any) => void;
    updateSort: (column: TableColumnCtx<any> | null, prop: string | null, order: TableSortOrder | null) => void;
    execFilter: () => void;
    execSort: () => void;
    execQuery: (ignore?: {
      filter: boolean;
    } | undefined) => void;
    clearFilter: (columnKeys?: string[] | string) => void;
    clearSort: () => void;
    toggleRowExpansion: (row: any, expanded?: boolean) => void;
    setExpandRowKeysAdapter: (val: string[]) => void;
    setCurrentRowKey: (key: string) => void;
    toggleRowExpansionAdapter: (row: any, expanded?: boolean) => void;
    isRowExpanded: (row: any) => boolean;
    updateExpandRows: () => void;
    updateCurrentRowData: () => void;
    loadOrToggle: (row: any) => void;
    updateTreeData: (ifChangeExpandRowKeys?: boolean, ifExpandAll?: boolean) => void;
    updateKeyChildren: (key: string, data: any[]) => void;
    states: {
      _currentRowKey: _$vue.Ref<string | null, string | null>;
      currentRow: _$vue.Ref<any, any>;
      expandRowKeys: _$vue.Ref<string[], string[]>;
      treeData: _$vue.Ref<Record<string, TreeData>, Record<string, TreeData>>;
      indent: _$vue.Ref<number, number>;
      lazy: _$vue.Ref<boolean, boolean>;
      lazyTreeNodeMap: _$vue.Ref<Record<string, any[]>, Record<string, any[]>>;
      lazyColumnIdentifier: _$vue.Ref<string, string>;
      childrenColumnName: _$vue.Ref<string, string>;
      checkStrictly: _$vue.Ref<boolean, boolean>;
      expandRows: _$vue.Ref<any[], any[]>;
      defaultExpandAll: _$vue.Ref<boolean, boolean>;
      tableSize: _$vue.Ref<any, any>;
      rowKey: _$vue.Ref<string | null, string | null>;
      data: _$vue.Ref<any[], any[]>;
      _data: _$vue.Ref<any[], any[]>;
      isComplex: _$vue.Ref<boolean, boolean>;
      _columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      originColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      columns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      fixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      rightFixedColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      leafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      fixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      rightFixedLeafColumns: _$vue.Ref<TableColumnCtx<any>[], TableColumnCtx<any>[]>;
      updateOrderFns: (() => void)[];
      leafColumnsLength: _$vue.Ref<number, number>;
      fixedLeafColumnsLength: _$vue.Ref<number, number>;
      rightFixedLeafColumnsLength: _$vue.Ref<number, number>;
      isAllSelected: _$vue.Ref<boolean, boolean>;
      selection: _$vue.Ref<any[], any[]>;
      selectionIndeterminate: _$vue.Ref<Record<string, boolean>, Record<string, boolean>>;
      reserveSelection: _$vue.Ref<boolean, boolean>;
      selectOnIndeterminate: _$vue.Ref<boolean, boolean>;
      selectable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
      rowExpandable: _$vue.Ref<((row: any, index: number) => boolean) | null, ((row: any, index: number) => boolean) | null>;
      filters: _$vue.Ref<StoreFilter, StoreFilter>;
      filteredData: _$vue.Ref<any[] | null, any[] | null>;
      sortingColumn: _$vue.Ref<TableColumnCtx<any> | null, TableColumnCtx<any> | null>;
      sortProp: _$vue.Ref<string | null, string | null>;
      sortOrder: _$vue.Ref<string | number | null, string | number | null>;
      hoverRow: _$vue.Ref<any, any>;
    };
    ns: {
      namespace: _$vue.ComputedRef<string>;
      b: (blockSuffix?: string) => string;
      e: (element?: string) => string;
      m: (modifier?: string) => string;
      be: (blockSuffix?: string, element?: string) => string;
      em: (element?: string, modifier?: string) => string;
      bm: (blockSuffix?: string, modifier?: string) => string;
      bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
      is: {
        (name: string, state: boolean | undefined): string;
        (name: string): string;
      };
      cssVar: (object: Record<string, string>) => Record<string, string>;
      cssVarName: (name: string) => string;
      cssVarBlock: (object: Record<string, string>) => Record<string, string>;
      cssVarBlockName: (name: string) => string;
    };
    t: Translator;
  };
  columns: _$vue.ComputedRef<TableColumnCtx<any>[]>;
  handleHeaderFooterMousewheel: (_event: WheelEvent, data: any) => void;
  handleMouseLeave: () => void;
  tableId: string;
  tableSize: _$vue.ComputedRef<"" | "default" | "small" | "large">;
  isHidden: _$vue.Ref<boolean, boolean>;
  isEmpty: _$vue.ComputedRef<boolean>;
  renderExpanded: _$vue.Ref<RenderExpanded<any> | null, RenderExpanded<any> | null>;
  resizeProxyVisible: _$vue.Ref<boolean, boolean>;
  resizeState: _$vue.Ref<{
    width: null | number;
    height: null | number;
    headerHeight: null | number;
  }, {
    width: null | number;
    height: null | number;
    headerHeight: null | number;
  } | {
    width: null | number;
    height: null | number;
    headerHeight: null | number;
  }>;
  isGroup: _$vue.Ref<boolean, boolean>;
  bodyWidth: _$vue.ComputedRef<string>;
  tableBodyStyles: _$vue.ComputedRef<{
    width: string;
  }>;
  emptyBlockStyle: _$vue.ComputedRef<{
    width: string;
    height: string;
  } | undefined>;
  debouncedUpdateLayout: _$lodash_unified0.DebouncedFunc<() => void>;
  /**
   * @description used in single selection Table, set a certain row selected. If called without any parameter, it will clear selection
   */
  setCurrentRow: (row: any) => void;
  /**
   * @description returns the currently selected rows
   */
  getSelectionRows: () => any[];
  /**
   * @description used in multiple selection Table, toggle if a certain row is selected. With the second parameter, you can directly set if this row is selected
   */
  toggleRowSelection: (row: any, selected?: boolean, ignoreSelectable?: boolean) => void;
  /**
   * @description used in multiple selection Table, clear user selection
   */
  clearSelection: () => void;
  /**
   * @description clear filters of the columns whose `columnKey` are passed in. If no params, clear all filters
   */
  clearFilter: (columnKeys?: string[] | string) => void;
  /**
   * @description used in multiple selection Table, toggle select all and deselect all
   */
  toggleAllSelection: () => void;
  /**
   * @description used in expandable Table or tree Table, toggle if a certain row is expanded. With the second parameter, you can directly set if this row is expanded or collapsed
   */
  toggleRowExpansion: (row: any, expanded?: boolean) => void;
  /**
   * @description clear sorting, restore data to the original order
   */
  clearSort: () => void;
  /**
   * @description refresh the layout of Table. When the visibility of Table changes, you may need to call this method to get a correct layout
   */
  doLayout: () => void;
  /**
   * @description sort Table manually. Property `prop` is used to set sort column, property `order` is used to set sort order
   */
  sort: (prop: string, order: string) => void;
  /**
   * @description used in lazy Table, must set `rowKey`, update key children
   */
  updateKeyChildren: (key: string, data: any[]) => void;
  t: Translator;
  setDragVisible: (visible: boolean) => void;
  context: Table<any>;
  computedSumText: _$vue.ComputedRef<string>;
  computedEmptyText: _$vue.ComputedRef<string>;
  computedTooltipEffect: _$vue.ComputedRef<string | undefined>;
  computedTooltipOptions: _$vue.ComputedRef<Partial<Pick<UseTooltipProps, "offset" | "appendTo" | "effect" | "enterable" | "popperClass" | "placement" | "popperOptions" | "showArrow" | "transition" | "showAfter" | "hideAfter">> | undefined>;
  tableLayout: _$vue.ComputedRef<"fixed" | "auto">;
  scrollbarViewStyle: {
    display: string;
    verticalAlign: string;
  };
  scrollbarStyle: _$vue.ComputedRef<{
    height: string;
    maxHeight?: undefined;
  } | {
    maxHeight: string;
    height?: undefined;
  } | {
    height?: undefined;
    maxHeight?: undefined;
  }>;
  scrollBarRef: _$vue.Ref<any, any>;
  /**
   * @description scrolls to a particular set of coordinates
   */
  scrollTo: (options: ScrollToOptions | number, yCoord?: number) => void;
  /**
   * @description set horizontal scroll position
   */
  setScrollLeft: (left?: number) => void;
  /**
   * @description set vertical scroll position
   */
  setScrollTop: (top?: number) => void;
  /**
   * @description whether to allow drag the last column
   */
  allowDragLastColumn: boolean;
}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, ("select" | "scroll" | "select-all" | "expand-change" | "current-change" | "selection-change" | "cell-mouse-enter" | "cell-mouse-leave" | "cell-contextmenu" | "cell-click" | "cell-dblclick" | "row-click" | "row-contextmenu" | "row-dblclick" | "header-click" | "header-contextmenu" | "sort-change" | "filter-change" | "header-dragend")[], "select" | "scroll" | "select-all" | "expand-change" | "current-change" | "selection-change" | "cell-mouse-enter" | "cell-mouse-leave" | "cell-contextmenu" | "cell-click" | "cell-dblclick" | "row-click" | "row-contextmenu" | "row-dblclick" | "header-click" | "header-contextmenu" | "sort-change" | "filter-change" | "header-dragend", _$vue.PublicProps, Readonly<_$vue.ExtractPropTypes<{
  data: {
    type: _$vue.PropType<any[]>;
    default: () => never[];
  };
  size: {
    readonly type: _$vue.PropType<EpPropMergeType<StringConstructor, "" | "default" | "small" | "large", never>>;
    readonly required: false;
    readonly validator: ((val: unknown) => boolean) | undefined;
    __epPropKey: true;
  };
  width: (StringConstructor | NumberConstructor)[];
  height: (StringConstructor | NumberConstructor)[];
  maxHeight: (StringConstructor | NumberConstructor)[];
  fit: {
    type: BooleanConstructor;
    default: boolean;
  };
  stripe: BooleanConstructor;
  border: BooleanConstructor;
  rowKey: _$vue.PropType<TableProps<any>["rowKey"]>;
  showHeader: {
    type: BooleanConstructor;
    default: boolean;
  };
  showSummary: BooleanConstructor;
  sumText: StringConstructor;
  summaryMethod: _$vue.PropType<TableProps<any>["summaryMethod"]>;
  rowClassName: _$vue.PropType<TableProps<any>["rowClassName"]>;
  rowStyle: _$vue.PropType<TableProps<any>["rowStyle"]>;
  cellClassName: _$vue.PropType<TableProps<any>["cellClassName"]>;
  cellStyle: _$vue.PropType<TableProps<any>["cellStyle"]>;
  headerRowClassName: _$vue.PropType<TableProps<any>["headerRowClassName"]>;
  headerRowStyle: _$vue.PropType<TableProps<any>["headerRowStyle"]>;
  headerCellClassName: _$vue.PropType<TableProps<any>["headerCellClassName"]>;
  headerCellStyle: _$vue.PropType<TableProps<any>["headerCellStyle"]>;
  highlightCurrentRow: BooleanConstructor;
  currentRowKey: (StringConstructor | NumberConstructor)[];
  emptyText: StringConstructor;
  expandRowKeys: _$vue.PropType<TableProps<any>["expandRowKeys"]>;
  defaultExpandAll: BooleanConstructor;
  rowExpandable: {
    type: _$vue.PropType<TableProps<any>["rowExpandable"]>;
  };
  defaultSort: _$vue.PropType<TableProps<any>["defaultSort"]>;
  tooltipEffect: StringConstructor;
  tooltipOptions: _$vue.PropType<TableProps<any>["tooltipOptions"]>;
  spanMethod: _$vue.PropType<TableProps<any>["spanMethod"]>;
  selectOnIndeterminate: {
    type: BooleanConstructor;
    default: boolean;
  };
  indent: {
    type: NumberConstructor;
    default: number;
  };
  treeProps: {
    type: _$vue.PropType<TableProps<any>["treeProps"]>;
    default: () => {
      hasChildren: string;
      children: string;
      checkStrictly: boolean;
    };
  };
  lazy: BooleanConstructor;
  load: _$vue.PropType<TableProps<any>["load"]>;
  style: {
    type: _$vue.PropType<TableProps<any>["style"]>;
    default: () => {};
  };
  className: {
    type: StringConstructor;
    default: string;
  };
  tableLayout: {
    type: _$vue.PropType<"fixed" | "auto">;
    default: string;
  };
  scrollbarAlwaysOn: BooleanConstructor;
  flexible: BooleanConstructor;
  showOverflowTooltip: {
    type: _$vue.PropType<TableProps<any>["showOverflowTooltip"]>;
    default: undefined;
  };
  tooltipFormatter: _$vue.PropType<TableProps<any>["tooltipFormatter"]>;
  appendFilterPanelTo: StringConstructor;
  scrollbarTabindex: {
    type: (StringConstructor | NumberConstructor)[];
    default: undefined;
  };
  allowDragLastColumn: {
    type: BooleanConstructor;
    default: boolean;
  };
  preserveExpandedContent: BooleanConstructor;
  nativeScrollbar: BooleanConstructor;
}>> & Readonly<{
  onScroll?: ((...args: any[]) => any) | undefined;
  onSelect?: ((...args: any[]) => any) | undefined;
  "onExpand-change"?: ((...args: any[]) => any) | undefined;
  "onCurrent-change"?: ((...args: any[]) => any) | undefined;
  "onSelect-all"?: ((...args: any[]) => any) | undefined;
  "onSelection-change"?: ((...args: any[]) => any) | undefined;
  "onCell-mouse-enter"?: ((...args: any[]) => any) | undefined;
  "onCell-mouse-leave"?: ((...args: any[]) => any) | undefined;
  "onCell-contextmenu"?: ((...args: any[]) => any) | undefined;
  "onCell-click"?: ((...args: any[]) => any) | undefined;
  "onCell-dblclick"?: ((...args: any[]) => any) | undefined;
  "onRow-click"?: ((...args: any[]) => any) | undefined;
  "onRow-contextmenu"?: ((...args: any[]) => any) | undefined;
  "onRow-dblclick"?: ((...args: any[]) => any) | undefined;
  "onHeader-click"?: ((...args: any[]) => any) | undefined;
  "onHeader-contextmenu"?: ((...args: any[]) => any) | undefined;
  "onSort-change"?: ((...args: any[]) => any) | undefined;
  "onFilter-change"?: ((...args: any[]) => any) | undefined;
  "onHeader-dragend"?: ((...args: any[]) => any) | undefined;
}>, {
  style: _$vue.StyleValue;
  border: boolean;
  className: string;
  tableLayout: "fixed" | "auto";
  data: any[];
  fit: boolean;
  scrollbarAlwaysOn: boolean;
  lazy: boolean;
  allowDragLastColumn: boolean;
  stripe: boolean;
  treeProps: TreeProps | undefined;
  showOverflowTooltip: boolean | Partial<Pick<UseTooltipProps, "offset" | "appendTo" | "effect" | "enterable" | "popperClass" | "placement" | "popperOptions" | "showArrow" | "transition" | "showAfter" | "hideAfter">> | undefined;
  showHeader: boolean;
  showSummary: boolean;
  highlightCurrentRow: boolean;
  defaultExpandAll: boolean;
  selectOnIndeterminate: boolean;
  indent: number;
  flexible: boolean;
  scrollbarTabindex: string | number;
  preserveExpandedContent: boolean;
  nativeScrollbar: boolean;
}, {}, {
  TableHeader: _$vue.DefineComponent<_$vue.ExtractPropTypes<{
    fixed: {
      type: StringConstructor;
      default: string;
    };
    store: {
      required: true;
      type: _$vue.PropType<TableHeaderProps<any>["store"]>;
    };
    border: BooleanConstructor;
    defaultSort: {
      type: _$vue.PropType<TableHeaderProps<any>["defaultSort"]>;
      default: () => {
        prop: string;
        order: string;
      };
    };
    appendFilterPanelTo: {
      type: StringConstructor;
    };
    allowDragLastColumn: {
      type: BooleanConstructor;
    };
  }>, {
    ns: {
      namespace: _$vue.ComputedRef<string>;
      b: (blockSuffix?: string) => string;
      e: (element?: string) => string;
      m: (modifier?: string) => string;
      be: (blockSuffix?: string, element?: string) => string;
      em: (element?: string, modifier?: string) => string;
      bm: (blockSuffix?: string, modifier?: string) => string;
      bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
      is: {
        (name: string, state: boolean | undefined): string;
        (name: string): string;
      };
      cssVar: (object: Record<string, string>) => Record<string, string>;
      cssVarName: (name: string) => string;
      cssVarBlock: (object: Record<string, string>) => Record<string, string>;
      cssVarBlockName: (name: string) => string;
    };
    t: Translator;
    filterPanels: _$vue.Ref<{}, {}>;
    onColumnsChange: (layout: TableLayout<DefaultRow>) => void;
    onScrollableChange: (layout: TableLayout<DefaultRow>) => void;
    columnRows: _$vue.ComputedRef<TableColumnCtx<any>[][]>;
    getHeaderRowClass: (rowIndex: number) => string;
    getHeaderRowStyle: (rowIndex: number) => any;
    getHeaderCellClass: (rowIndex: number, columnIndex: number, row: any, column: TableColumnCtx<any>) => string;
    getHeaderCellStyle: (rowIndex: number, columnIndex: number, row: any, column: TableColumnCtx<any>) => _$vue.CSSProperties;
    handleHeaderClick: (event: Event, column: TableColumnCtx<any>) => void;
    handleHeaderContextMenu: (event: Event, column: TableColumnCtx<any>) => void;
    handleMouseDown: (event: MouseEvent, column: TableColumnCtx<any>) => void;
    handleMouseMove: (event: MouseEvent, column: TableColumnCtx<any>) => void;
    handleMouseOut: () => void;
    handleSortClick: (event: Event, column: TableColumnCtx<any>, givenOrder?: TableSortOrder | boolean) => void;
    handleFilterClick: (event: Event) => void;
    isGroup: _$vue.ComputedRef<boolean>;
    toggleAllSelection: (event: Event) => void;
    saveIndexSelection: _$vue.Reactive<Map<any, any>>;
    isTableLayoutAuto: boolean;
    theadRef: _$vue.Ref<any, any>;
    updateFixedColumnStyle: () => void;
  }, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {}, string, _$vue.PublicProps, Readonly<_$vue.ExtractPropTypes<{
    fixed: {
      type: StringConstructor;
      default: string;
    };
    store: {
      required: true;
      type: _$vue.PropType<TableHeaderProps<any>["store"]>;
    };
    border: BooleanConstructor;
    defaultSort: {
      type: _$vue.PropType<TableHeaderProps<any>["defaultSort"]>;
      default: () => {
        prop: string;
        order: string;
      };
    };
    appendFilterPanelTo: {
      type: StringConstructor;
    };
    allowDragLastColumn: {
      type: BooleanConstructor;
    };
  }>> & Readonly<{}>, {
    fixed: string;
    border: boolean;
    defaultSort: Sort;
    allowDragLastColumn: boolean;
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
  TableBody: _$vue.DefineComponent<_$vue.ExtractPropTypes<{
    store: {
      required: boolean;
      type: _$vue.PropType<TableBodyProps<any>["store"]>;
    };
    stripe: BooleanConstructor;
    tooltipEffect: StringConstructor;
    tooltipOptions: {
      type: _$vue.PropType<TableBodyProps<any>["tooltipOptions"]>;
    };
    context: {
      default: () => {};
      type: _$vue.PropType<TableBodyProps<any>["context"]>;
    };
    rowClassName: _$vue.PropType<TableBodyProps<any>["rowClassName"]>;
    rowStyle: _$vue.PropType<TableBodyProps<any>["rowStyle"]>;
    fixed: {
      type: StringConstructor;
      default: string;
    };
    highlight: BooleanConstructor;
  }>, {
    ns: {
      namespace: _$vue.ComputedRef<string>;
      b: (blockSuffix?: string) => string;
      e: (element?: string) => string;
      m: (modifier?: string) => string;
      be: (blockSuffix?: string, element?: string) => string;
      em: (element?: string, modifier?: string) => string;
      bm: (blockSuffix?: string, modifier?: string) => string;
      bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
      is: {
        (name: string, state: boolean | undefined): string;
        (name: string): string;
      };
      cssVar: (object: Record<string, string>) => Record<string, string>;
      cssVarName: (name: string) => string;
      cssVarBlock: (object: Record<string, string>) => Record<string, string>;
      cssVarBlockName: (name: string) => string;
    };
    onColumnsChange: (layout: TableLayout<DefaultRow>) => void;
    onScrollableChange: (layout: TableLayout<DefaultRow>) => void;
    wrappedRowRender: (row: any, $index: number) => _$vue.VNode<_$vue.RendererNode, _$vue.RendererElement, {
      [key: string]: any;
    }> | _$vue.VNode<_$vue.RendererNode, _$vue.RendererElement, {
      [key: string]: any;
    }>[] | _$vue.VNode<_$vue.RendererNode, _$vue.RendererElement, {
      [key: string]: any;
    }>[][];
    tooltipContent: _$vue.Ref<string, string>;
    tooltipTrigger: _$vue.Ref<_$vue.VNode<_$vue.RendererNode, _$vue.RendererElement, {
      [key: string]: any;
    }>, _$vue.VNode<_$vue.RendererNode, _$vue.RendererElement, {
      [key: string]: any;
    }>>;
  }, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {}, string, _$vue.PublicProps, Readonly<_$vue.ExtractPropTypes<{
    store: {
      required: boolean;
      type: _$vue.PropType<TableBodyProps<any>["store"]>;
    };
    stripe: BooleanConstructor;
    tooltipEffect: StringConstructor;
    tooltipOptions: {
      type: _$vue.PropType<TableBodyProps<any>["tooltipOptions"]>;
    };
    context: {
      default: () => {};
      type: _$vue.PropType<TableBodyProps<any>["context"]>;
    };
    rowClassName: _$vue.PropType<TableBodyProps<any>["rowClassName"]>;
    rowStyle: _$vue.PropType<TableBodyProps<any>["rowStyle"]>;
    fixed: {
      type: StringConstructor;
      default: string;
    };
    highlight: BooleanConstructor;
  }>> & Readonly<{}>, {
    fixed: string;
    context: Table<any>;
    stripe: boolean;
    highlight: boolean;
  }, {}, {}, {}, string, _$vue.ComponentProvideOptions, true, {}, any>;
  TableFooter: _$vue.DefineComponent<_$vue.ExtractPropTypes<{
    fixed: {
      type: StringConstructor;
      default: string;
    };
    store: {
      required: true;
      type: _$vue.PropType<TableFooter<any>["store"]>;
    };
    summaryMethod: _$vue.PropType<TableFooter<any>["summaryMethod"]>;
    sumText: StringConstructor;
    border: BooleanConstructor;
    defaultSort: {
      type: _$vue.PropType<TableFooter<any>["defaultSort"]>;
      default: () => {
        prop: string;
        order: string;
      };
    };
  }>, {
    ns: {
      namespace: _$vue.ComputedRef<string>;
      b: (blockSuffix?: string) => string;
      e: (element?: string) => string;
      m: (modifier?: string) => string;
      be: (blockSuffix?: string, element?: string) => string;
      em: (element?: string, modifier?: string) => string;
      bm: (blockSuffix?: string, modifier?: string) => string;
      bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
      is: {
        (name: string, state: boolean | undefined): string;
        (name: string): string;
      };
      cssVar: (object: Record<string, string>) => Record<string, string>;
      cssVarName: (name: string) => string;
      cssVarBlock: (object: Record<string, string>) => Record<string, string>;
      cssVarBlockName: (name: string) => string;
    };
    onScrollableChange: (layout: TableLayout<any>) => void;
    onColumnsChange: (layout: TableLayout<any>) => void;
    getCellClasses: (columns: TableColumnCtx<any>[], cellIndex: number) => string[];
    getCellStyles: (column: TableColumnCtx<any>, cellIndex: number) => _$vue.CSSProperties | undefined;
    columns: _$vue.ComputedRef<TableColumnCtx<DefaultRow>[]>;
  }, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {}, string, _$vue.PublicProps, Readonly<_$vue.ExtractPropTypes<{
    fixed: {
      type: StringConstructor;
      default: string;
    };
    store: {
      required: true;
      type: _$vue.PropType<TableFooter<any>["store"]>;
    };
    summaryMethod: _$vue.PropType<TableFooter<any>["summaryMethod"]>;
    sumText: StringConstructor;
    border: BooleanConstructor;
    defaultSort: {
      type: _$vue.PropType<TableFooter<any>["defaultSort"]>;
      default: () => {
        prop: string;
        order: string;
      };
    };
  }>> & Readonly<{}>, {
    fixed: string;
    border: boolean;
    defaultSort: Sort;
  }, {}, {}, {}, string, _$vue.ComponentProvideOptions, true, {}, any>;
  ElScrollbar: SFCWithInstall<{
    new (...args: any[]): _$vue.CreateComponentPublicInstanceWithMixins<Readonly<ScrollbarProps> & Readonly<{
      onScroll?: ((args_0: {
        scrollTop: number;
        scrollLeft: number;
      }) => any) | undefined;
      "onEnd-reached"?: ((direction: ScrollbarDirection) => any) | undefined;
    }>, {
      wrapRef: _$vue.Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
      update: () => void;
      scrollTo: {
        (xCord: number, yCord?: number): void;
        (options: ScrollToOptions): void;
      };
      setScrollTop: (value: number) => void;
      setScrollLeft: (value: number) => void;
      handleScroll: () => void;
    }, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
      scroll: (args_0: {
        scrollTop: number;
        scrollLeft: number;
      }) => void;
      "end-reached": (direction: ScrollbarDirection) => void;
    }, _$vue.PublicProps, {
      tag: keyof HTMLElementTagNameMap | (string & {});
      tabindex: number | string;
      height: number | string;
      maxHeight: number | string;
      distance: number;
      wrapStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
      wrapClass: string | string[];
      viewClass: string | string[];
      viewStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
      minSize: number;
    }, false, {}, {}, _$vue.GlobalComponents, _$vue.GlobalDirectives, string, {}, any, _$vue.ComponentProvideOptions, {
      P: {};
      B: {};
      D: {};
      C: {};
      M: {};
      Defaults: {};
    }, Readonly<ScrollbarProps> & Readonly<{
      onScroll?: ((args_0: {
        scrollTop: number;
        scrollLeft: number;
      }) => any) | undefined;
      "onEnd-reached"?: ((direction: ScrollbarDirection) => any) | undefined;
    }>, {
      wrapRef: _$vue.Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
      update: () => void;
      scrollTo: {
        (xCord: number, yCord?: number): void;
        (options: ScrollToOptions): void;
      };
      setScrollTop: (value: number) => void;
      setScrollLeft: (value: number) => void;
      handleScroll: () => void;
    }, {}, {}, {}, {
      tag: keyof HTMLElementTagNameMap | (string & {});
      tabindex: number | string;
      height: number | string;
      maxHeight: number | string;
      distance: number;
      wrapStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
      wrapClass: string | string[];
      viewClass: string | string[];
      viewStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
      minSize: number;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
  } & _$vue.ComponentOptionsBase<Readonly<ScrollbarProps> & Readonly<{
    onScroll?: ((args_0: {
      scrollTop: number;
      scrollLeft: number;
    }) => any) | undefined;
    "onEnd-reached"?: ((direction: ScrollbarDirection) => any) | undefined;
  }>, {
    wrapRef: _$vue.Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    update: () => void;
    scrollTo: {
      (xCord: number, yCord?: number): void;
      (options: ScrollToOptions): void;
    };
    setScrollTop: (value: number) => void;
    setScrollLeft: (value: number) => void;
    handleScroll: () => void;
  }, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, {
    scroll: (args_0: {
      scrollTop: number;
      scrollLeft: number;
    }) => void;
    "end-reached": (direction: ScrollbarDirection) => void;
  }, string, {
    tag: keyof HTMLElementTagNameMap | (string & {});
    tabindex: number | string;
    height: number | string;
    maxHeight: number | string;
    distance: number;
    wrapStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
    wrapClass: string | string[];
    viewClass: string | string[];
    viewStyle: string | false | _$vue.CSSProperties | _$vue.StyleValue[] | null;
    minSize: number;
  }, {}, string, {}, _$vue.GlobalComponents, _$vue.GlobalDirectives, string, _$vue.ComponentProvideOptions> & _$vue.VNodeProps & _$vue.AllowedComponentProps & _$vue.ComponentCustomProps & (new () => {
    $slots: {
      default?: (props: {}) => any;
    };
  })>;
  hColgroup: typeof hColgroup;
}, {
  Mousewheel: _$vue.ObjectDirective<WheelElement, MousewheelCallback, string, any>;
}, string, _$vue.ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };