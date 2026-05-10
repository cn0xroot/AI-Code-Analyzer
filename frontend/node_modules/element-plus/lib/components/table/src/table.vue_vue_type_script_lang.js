require("../../../_virtual/_rolldown/runtime.js");
const require_index = require("../../../hooks/use-locale/index.js");
const require_index$1 = require("../../../hooks/use-namespace/index.js");
const require_index$2 = require("../../scrollbar/index.js");
const require_use_global_config = require("../../config-provider/src/hooks/use-global-config.js");
const require_index$3 = require("../../../directives/mousewheel/index.js");
const require_helper = require("./store/helper.js");
const require_table_layout = require("./table-layout.js");
const require_tokens = require("./tokens.js");
const require_utils_helper = require("./table-header/utils-helper.js");
const require_index$4 = require("./table-header/index.js");
const require_index$5 = require("./table-body/index.js");
const require_index$6 = require("./table-footer/index.js");
const require_utils_helper$1 = require("./table/utils-helper.js");
const require_style_helper = require("./table/style-helper.js");
const require_key_render_helper = require("./table/key-render-helper.js");
const require_defaults = require("./table/defaults.js");
const require_h_helper = require("./h-helper.js");
const require_use_scrollbar = require("./composables/use-scrollbar.js");
let lodash_unified = require("lodash-unified");
let vue = require("vue");
//#region ../../packages/components/table/src/table.vue?vue&type=script&lang.ts
let tableIdSeed = 1;
var table_vue_vue_type_script_lang_default = (0, vue.defineComponent)({
	name: "ElTable",
	directives: { Mousewheel: require_index$3.default },
	components: {
		TableHeader: require_index$4.default,
		TableBody: require_index$5.default,
		TableFooter: require_index$6.default,
		ElScrollbar: require_index$2.ElScrollbar,
		hColgroup: require_h_helper.hColgroup
	},
	props: require_defaults.default,
	emits: [
		"select",
		"select-all",
		"selection-change",
		"cell-mouse-enter",
		"cell-mouse-leave",
		"cell-contextmenu",
		"cell-click",
		"cell-dblclick",
		"row-click",
		"row-contextmenu",
		"row-dblclick",
		"header-click",
		"header-contextmenu",
		"sort-change",
		"filter-change",
		"current-change",
		"header-dragend",
		"expand-change",
		"scroll"
	],
	setup(props) {
		const { t } = require_index.useLocale();
		const ns = require_index$1.useNamespace("table");
		const globalConfig = require_use_global_config.useGlobalConfig("table");
		const table = (0, vue.getCurrentInstance)();
		(0, vue.provide)(require_tokens.TABLE_INJECTION_KEY, table);
		const store = require_helper.createStore(table, props);
		table.store = store;
		const layout = new require_table_layout.default({
			store: table.store,
			table,
			fit: props.fit,
			showHeader: props.showHeader
		});
		table.layout = layout;
		const isEmpty = (0, vue.computed)(() => (store.states.data.value || []).length === 0);
		/**
		* open functions
		*/
		const { setCurrentRow, getSelectionRows, toggleRowSelection, clearSelection, clearFilter, toggleAllSelection, toggleRowExpansion, clearSort, sort, updateKeyChildren } = require_utils_helper$1.default(store);
		const { isHidden, renderExpanded, setDragVisible, isGroup, handleMouseLeave, handleHeaderFooterMousewheel, tableSize, emptyBlockStyle, resizeProxyVisible, bodyWidth, resizeState, doLayout, tableBodyStyles, tableLayout, scrollbarViewStyle, scrollbarStyle } = require_style_helper.default(props, layout, store, table);
		const { scrollBarRef, scrollTo, setScrollLeft, setScrollTop } = require_use_scrollbar.useScrollbar();
		const debouncedUpdateLayout = (0, lodash_unified.debounce)(doLayout, 50);
		const tableId = `${ns.namespace.value}-table_${tableIdSeed++}`;
		table.tableId = tableId;
		table.state = {
			isGroup,
			resizeState,
			doLayout,
			debouncedUpdateLayout
		};
		const computedSumText = (0, vue.computed)(() => props.sumText ?? t("el.table.sumText"));
		const computedEmptyText = (0, vue.computed)(() => {
			return props.emptyText ?? t("el.table.emptyText");
		});
		const computedTooltipEffect = (0, vue.computed)(() => props.tooltipEffect ?? globalConfig.value?.tooltipEffect);
		const computedTooltipOptions = (0, vue.computed)(() => props.tooltipOptions ?? globalConfig.value?.tooltipOptions);
		const columns = (0, vue.computed)(() => {
			return require_utils_helper.convertToRows(store.states.originColumns.value)[0];
		});
		require_key_render_helper.default(table);
		(0, vue.onBeforeUnmount)(() => {
			debouncedUpdateLayout.cancel();
		});
		return {
			ns,
			layout,
			store,
			columns,
			handleHeaderFooterMousewheel,
			handleMouseLeave,
			tableId,
			tableSize,
			isHidden,
			isEmpty,
			renderExpanded,
			resizeProxyVisible,
			resizeState,
			isGroup,
			bodyWidth,
			tableBodyStyles,
			emptyBlockStyle,
			debouncedUpdateLayout,
			/**
			* @description used in single selection Table, set a certain row selected. If called without any parameter, it will clear selection
			*/
			setCurrentRow,
			/**
			* @description returns the currently selected rows
			*/
			getSelectionRows,
			/**
			* @description used in multiple selection Table, toggle if a certain row is selected. With the second parameter, you can directly set if this row is selected
			*/
			toggleRowSelection,
			/**
			* @description used in multiple selection Table, clear user selection
			*/
			clearSelection,
			/**
			* @description clear filters of the columns whose `columnKey` are passed in. If no params, clear all filters
			*/
			clearFilter,
			/**
			* @description used in multiple selection Table, toggle select all and deselect all
			*/
			toggleAllSelection,
			/**
			* @description used in expandable Table or tree Table, toggle if a certain row is expanded. With the second parameter, you can directly set if this row is expanded or collapsed
			*/
			toggleRowExpansion,
			/**
			* @description clear sorting, restore data to the original order
			*/
			clearSort,
			/**
			* @description refresh the layout of Table. When the visibility of Table changes, you may need to call this method to get a correct layout
			*/
			doLayout,
			/**
			* @description sort Table manually. Property `prop` is used to set sort column, property `order` is used to set sort order
			*/
			sort,
			/**
			* @description used in lazy Table, must set `rowKey`, update key children
			*/
			updateKeyChildren,
			t,
			setDragVisible,
			context: table,
			computedSumText,
			computedEmptyText,
			computedTooltipEffect,
			computedTooltipOptions,
			tableLayout,
			scrollbarViewStyle,
			scrollbarStyle,
			scrollBarRef,
			/**
			* @description scrolls to a particular set of coordinates
			*/
			scrollTo,
			/**
			* @description set horizontal scroll position
			*/
			setScrollLeft,
			/**
			* @description set vertical scroll position
			*/
			setScrollTop,
			/**
			* @description whether to allow drag the last column
			*/
			allowDragLastColumn: props.allowDragLastColumn
		};
	}
});
//#endregion
exports.default = table_vue_vue_type_script_lang_default;

//# sourceMappingURL=table.vue_vue_type_script_lang.js.map