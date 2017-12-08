#!/usr/bin/env node
//const fs = require('fs');

const remark = require('remark');
const select = require('unist-util-select');
const html = require('remark-html');

let inputFile = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (inputFile += chunk));
process.stdin.on('end', () => {
	remark()
		.use(require('.'))
		.use(html)
		.process(inputFile.replace(/\t/g, '  '), function(err, file) {
			if (err) throw err;
			process.stdout.write(
				`data:text/html;base64,${new Buffer(file.toString(), 'utf8').toString('base64')}`
			);
		});
});
process.stdin.resume();
