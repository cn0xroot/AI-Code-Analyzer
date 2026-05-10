import { buildProps, definePropType } from "../../../utils/vue/props/runtime.mjs";
//#region ../../packages/components/divider/src/divider.ts
/**
* @deprecated Removed after 3.0.0, Use `DividerProps` instead.
*/
const dividerProps = buildProps({
	/**
	* @description Set divider's direction
	*/
	direction: {
		type: String,
		values: ["horizontal", "vertical"],
		default: "horizontal"
	},
	/**
	* @description Set the style of divider
	*/
	contentPosition: {
		type: String,
		values: [
			"left",
			"center",
			"right"
		],
		default: "center"
	},
	/**
	* @description the position of the customized content on the divider line
	*/
	borderStyle: {
		type: definePropType(String),
		default: "solid"
	}
});
//#endregion
export { dividerProps };

//# sourceMappingURL=divider.mjs.map