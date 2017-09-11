#!/usr/bin/env node
const fs = require('fs');

const remark = require('remark');
const select = require('unist-util-select');
const html = require('remark-html');

const testFile = fs.readFileSync('test.md');

remark().use(require('.')).use(html).process(testFile, function(err, file) {
	if (err) throw err;
	fs.writeFileSync('test.html', file);
});
