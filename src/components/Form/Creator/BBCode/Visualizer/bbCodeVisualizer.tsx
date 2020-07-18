import React, { useState, useEffect } from "react";
type BBCodeVisualierProps = {
	bbCode: string;
};

type BBCodeElem = {
	type: string;
	bbOpen: RegExp;
	bbClose: RegExp | string;
	htmlOpen: string;
	htmlOpenStyles?: string;
	htmlClose: string;
};

const escapedRegExp = (unescapedRegExp: string) =>
	new RegExp(unescapedRegExp.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");

const bbCodeElems: BBCodeElem[] = [
	{
		type: "bold",
		bbOpen: escapedRegExp("[b]"),
		bbClose: escapedRegExp("[/b]"),
		htmlOpen: "<b>",
		htmlClose: "</b>"
	},
	{
		type: "underline",
		bbOpen: escapedRegExp("[u]"),
		bbClose: escapedRegExp("[/u]"),
		htmlOpen: "<ins>",
		htmlClose: "</ins>"
	},
	{
		type: "italics",
		bbOpen: escapedRegExp("[i]"),
		bbClose: escapedRegExp("[/i]"),
		htmlOpen: "<i>",
		htmlClose: "</i>"
	},
	{
		type: "hr",
		bbOpen: escapedRegExp("[hr]"),
		bbClose: escapedRegExp("[/hr]"),
		htmlOpen: `<hr>`,
		htmlClose: `</hr>`
	},
	{
		type: "center",
		bbOpen: escapedRegExp("[center]"),
		bbClose: escapedRegExp("[/center]"),
		htmlOpen: `<div style="text-align: center;">`,
		htmlClose: `</div>`
	},
	{
		type: "right",
		bbOpen: escapedRegExp("[right]"),
		bbClose: escapedRegExp("[/right]"),
		htmlOpen: `<div align="right">`,
		htmlClose: `</div>`
	},
	{
		type: "checkboxOpen",
		bbOpen: escapedRegExp("[cb]"),
		bbClose: escapedRegExp("[/cb]"),
		htmlOpen: `<input type="checkbox">`,
		htmlClose: `</input>`
	},
	{
		type: "checkboxClosed",
		bbOpen: escapedRegExp("[cbc]"),
		bbClose: escapedRegExp("[/cbc]"),
		htmlOpen: `<input type="checkbox checked">`,
		htmlClose: `</input>`
	},
	{
		type: "image",
		bbOpen: escapedRegExp(`[img]`),
		bbClose: escapedRegExp(`[/img]`),
		htmlOpen: `<img src="`,
		htmlClose: `"/>`
	},
	{
		type: `divbox`,
		bbOpen: new RegExp(/\[divbox=(\w+|#\w{6})\]/, "g"),
		bbClose: new RegExp(/\[\/divbox\]/, "g"),
		htmlOpen: `<div`,
		htmlClose: `</div>`,
		htmlOpenStyles:
			"border: 1px solid black; margin: 10px 10px; padding-left: 5px; padding-right: 5px; background-color: "
	},
	{
		type: `divbox2`,
		bbOpen: new RegExp(/\[divbox2=(\w+|#\w{6})\]/, "g"),
		bbClose: new RegExp(/\[\/divbox2\]/, "g"),
		htmlOpen: `<div`,
		htmlClose: `</div>`,
		htmlOpenStyles:
			"border: 1px solid black; margin: 10px 10px; padding: 25px; background-color: "
	},
	{
		type: `color`,
		bbOpen: new RegExp(/\[color=(\w+|#\w{6})\]/, "g"),
		bbClose: new RegExp(/\[\/color\]/, "g"),
		htmlOpen: `<span`,
		htmlClose: `</span>`,
		htmlOpenStyles: "color: "
	},
	{
		type: "aligntable",
		bbOpen: new RegExp(
			/\[aligntable=(\w+),(\d+),(\d+),(\d+),(\d+),(\d+),(\w+)\]/,
			"g"
		),
		bbClose: new RegExp(/\[\/aligntable\]/, "g"),
		htmlOpen: `<div><table>`,
		htmlClose: `</td></tr></tbody></table></div>`,
		htmlOpenStyles: ""
	}
];

// divbox: match entire opening tag with the color hex code regexp: \[divbox2=#\w{6}\]

const BBCodeVisualizer = ({ bbCode }: BBCodeVisualierProps) => {
	const [convertedBBCode, setConvertedBBCode] = useState(bbCode);

	const convertBBCode = () => {
		var newlyConvertedBBCode = convertedBBCode.concat();

		bbCodeElems.forEach((bbCodeElem) => {
			switch (bbCodeElem.type) {
				case "aligntable":
					var openBBTags: IterableIterator<RegExpMatchArray> = newlyConvertedBBCode.matchAll(
						bbCodeElem.bbOpen
					);
					for (const openBBTag of openBBTags) {
						console.log(openBBTag);
						newlyConvertedBBCode = newlyConvertedBBCode.replace(
							openBBTag[0],
							`<div style="float: ${openBBTag[1]}; margin-left: ${openBBTag[3]}px; margin-right: ${openBBTag[4]}px;"><table style="width: ${openBBTag[2]}px; border-width: ${openBBTag[5]}px; border-color: ${openBBTag[6]}; background-color: ${openBBTag[7]}; "><tbody><tr><td>`
						);
					}
					newlyConvertedBBCode = newlyConvertedBBCode.replace(
						bbCodeElem.bbClose,
						bbCodeElem.htmlClose
					);

					break;
				// BBCode Tags with non-nested customizeable styles
				case "divbox":
				case "divbox2":
				case "color":
					openBBTags = newlyConvertedBBCode.matchAll(bbCodeElem.bbOpen);
					for (const openBBTag of openBBTags) {
						newlyConvertedBBCode = newlyConvertedBBCode.replace(
							openBBTag[0],
							`${bbCodeElem.htmlOpen} style=" ${bbCodeElem.htmlOpenStyles} ${openBBTag[1]}; ">`
						);
					}
					newlyConvertedBBCode = newlyConvertedBBCode.replace(
						bbCodeElem.bbClose,
						bbCodeElem.htmlClose
					);
					break;
				default:
					newlyConvertedBBCode = newlyConvertedBBCode.replace(
						bbCodeElem.bbOpen,
						bbCodeElem.htmlOpen
					);
					newlyConvertedBBCode = newlyConvertedBBCode.replace(
						bbCodeElem.bbClose,
						bbCodeElem.htmlClose
					);
			}

			// Handle simple BBCode elements first ([b], [u], etc )
		});

		// Handle complex BBCode Elements ([img]src[/img], [divbox=#XXXXXX], etc)
		const imageEscapedRegEx = escapedRegExp("[img][/img]");

		setConvertedBBCode(newlyConvertedBBCode);
	};

	useEffect(() => {
		convertBBCode();
	}, [bbCode]);

	function htmlBBCode() {
		return {
			__html: convertedBBCode.replace(new RegExp(/\r?\n+/, "g"), "<br />")
		};
	}

	return (
		<div style={{ display: "table", tableLayout: "fixed", width: "100%" }}>
			<div style={{ width: "76%", display: "table-cell" }}>
				<div
					dangerouslySetInnerHTML={htmlBBCode()}
					style={{
						overflow: "auto",
						fontFamily: "Tahoma, Arial, Helvetica, sans-serif",
						lineHeight: "21px",
						fontSize: "14px"
					}}></div>
			</div>
		</div>
	);
};

export default BBCodeVisualizer;
