const CSS = `
table {
	border: none;
	border-collapse: collapse;
}

td {
	padding-top: 10px;
	padding-bottom: 10px;
}

p { 
	margin: 0;
}

td:first-child {
	padding-right: 15px;
	text-align: right;
}

td:nth-child(2) {
	width: 75vw !important;
	border-left: 1px solid black;
	padding-left: 20px;
}

td > * {
	margin-top: 0;
	margin-bottom: 0;
} 

td > ul, td > ol {
	padding-left: 10px;
}

* {
	font-family: 'Avenir Next', Arial, sans-serif;
}
`;

module.exports = function cornellNotes() {
	return transformer;

	function generateCornell(list) {
		return list.children.map(listItem => {
			let label =
				listItem.children[0].type === 'paragraph' || listItem.children[0].type === 'text'
					? listItem.children.shift()
					: { type: 'text', value: '' };
			return {
				type: 'tableRow',
				children: [
					{ type: 'tableCell', children: [label] },
					{ type: 'tableCell', children: listItem.children },
				],
			};
		});
	}

	function transformer(tree, file) {
		const nodes = tree.children;
		const tableRows = [];
		let summary = null;
		let title = null;
		let cur = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node.type === 'list') {
				tableRows.push({
					type: 'tableRow',
					children: [
						{ type: 'tableCell', children: [{ type: 'text', value: '' }] },
						{ type: 'tableCell', children: cur },
					],
				});
				cur = [];
				tableRows.push(...generateCornell(node));
			} else if ((node.type === 'text' || node.type === 'paragraph') && !summary) {
				summary = node;
			} else if (node.type === 'heading' && !title) {
				title = node;
			} else {
				cur.push(node);
			}
		}
		if (cur) {
			tableRows.push({
				type: 'tableRow',
				children: [
					{ type: 'tableCell', children: [{ type: 'text', value: '' }] },
					{ type: 'tableCell', children: cur },
				],
			});
		}
		tree.children = [
			{ type: 'html', value: `<style>${CSS}</style>` },
			title,
			{ type: 'blockquote', children: [summary] },
			{ type: 'table', align: [null, null], children: tableRows },
		];
	}
};
