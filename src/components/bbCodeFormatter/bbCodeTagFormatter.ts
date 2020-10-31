type BBCodeTagFormatterProps = {
	tagType: string;
	text: string;
	selectionStart: number;
	selectionEnd: number;
	updateText: (text: string, cursorPos: number) => void;
};
const bbCodeTagFormatter = ({
	tagType,
	text,
	selectionStart,
	selectionEnd,
	updateText
}: BBCodeTagFormatterProps): void => {
	const before = text.substring(0, selectionStart);
	let between = "";
	const after = text.substring(selectionEnd);
	let updatedText = "";
	switch (tagType) {
		case "bold":
			between = `[b]${text.substring(selectionStart, selectionEnd)}[/b]`;
			updatedText = before + between + after;

			updateText(
				updatedText,
				selectionStart === selectionEnd
					? (before + between.substring(0, between.indexOf("[/b]"))).length
					: (before + between).length
			);
			break;
		case "italic":
			between = `[i]${text.substring(selectionStart, selectionEnd)}[/i]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				selectionStart === selectionEnd
					? (before + between.substring(0, between.indexOf("[/i]"))).length
					: (before + between).length
			);
			break;
		case "underline":
			between = `[u]${text.substring(selectionStart, selectionEnd)}[/u]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				selectionStart === selectionEnd
					? (before + between.substring(0, between.indexOf("[/u]"))).length
					: (before + between).length
			);
			break;
		case "image":
			between = `[img]${text.substring(selectionStart, selectionEnd)}[/img]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				selectionStart === selectionEnd
					? (before + between.substring(0, between.indexOf("[/img]"))).length
					: (before + between).length
			);
			break;
		case "spoiler":
			between = `[spoiler]
${text.substring(selectionStart, selectionEnd)}
[/spoiler]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				selectionStart === selectionEnd
					? (before + between.substring(0, between.indexOf("[/spoiler]")))
							.length
					: (before + between).length
			);
			break;
		case "altspoiler":
			between = `[altspoiler=]
${text.substring(selectionStart, selectionEnd)}
[/altspoiler]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				(before + between.substring(0, between.indexOf("]"))).length
			);
			break;
		case "altspoiler2":
			between = `[altspoiler2=]
${text.substring(selectionStart, selectionEnd)}
[/altspoiler2]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				(before + between.substring(0, between.indexOf("]"))).length
			);
			break;

		case "url":
			between = `[url=]${text.substring(selectionStart, selectionEnd)}[/url]`;
			updatedText = before + between + after;
			updateText(
				updatedText,
				(before + between.substring(0, between.indexOf("]"))).length
			);
			break;
	}
};

export default bbCodeTagFormatter;
