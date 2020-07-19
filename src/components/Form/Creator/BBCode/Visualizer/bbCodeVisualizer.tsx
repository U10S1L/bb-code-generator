import React, { useState, useEffect, useCallback } from "react";

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
		type: "left",
		bbOpen: escapedRegExp("[left]"),
		bbClose: escapedRegExp("[/left]"),
		htmlOpen: `<div align="left">`,
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
		type: "url",
		bbOpen: new RegExp(/\[url=\w*\]/, "g"),
		bbClose: escapedRegExp("[/url]"),
		htmlOpen: `<a href="#" style="border-bottom: 1px dotted #6b6b6b;" >`,
		htmlClose: `</a>`
	},
	{
		type: "list",
		bbOpen: escapedRegExp("[list]"),
		bbClose: escapedRegExp("[/list]"),
		htmlOpen: `<ul>`,
		htmlClose: `</ul>`
	},
	{
		type: "listitem",
		bbOpen: escapedRegExp("[*]"),
		bbClose: escapedRegExp(""),
		htmlOpen: "<li>",
		htmlClose: ""
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
		htmlOpen: `<div>`,
		htmlClose: `</div>`
	}
];

// divbox: match entire opening tag with the color hex code regexp: \[divbox2=#\w{6}\]

const BBCodeVisualizer = ({ bbCode }: BBCodeVisualierProps) => {
	const [convertedBBCode, setConvertedBBCode] = useState(bbCode);

	const convertBBCode = useCallback(() => {
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
							`<div style="margin-left: ${openBBTag[3]}px; margin-right: ${openBBTag[4]}px;  border-width: ${openBBTag[5]}px; border-color: ${openBBTag[6]}; background-color: ${openBBTag[7]}; ">`
						);
					}
					newlyConvertedBBCode = newlyConvertedBBCode.replace(
						bbCodeElem.bbClose,
						bbCodeElem.htmlClose
					);

					break;
				case "divbox":
				case "divbox2":
				case "color":
					openBBTags = newlyConvertedBBCode.matchAll(bbCodeElem.bbOpen);
					for (const openBBTag of openBBTags) {
						newlyConvertedBBCode = newlyConvertedBBCode.replace(
							openBBTag[0],
							`${bbCodeElem.htmlOpen}  style=" ${bbCodeElem.htmlOpenStyles} ${openBBTag[1]}; ">`
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
		});

		setConvertedBBCode(newlyConvertedBBCode);
	}, [convertedBBCode]);

	useEffect(() => {
		convertBBCode();
	}, [bbCode, convertBBCode]);

	function htmlBBCode() {
		return {
			__html: convertedBBCode
		};
	}

	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<div
				dangerouslySetInnerHTML={htmlBBCode()}
				style={{
					overflow: "auto",
					fontFamily: "Tahoma, Arial, Helvetica, sans-serif",
					lineHeight: "21px",
					fontSize: "14px",
					whiteSpace: "pre-wrap",
					width: "100%"
				}}></div>
		</div>
	);
};

export default BBCodeVisualizer;
