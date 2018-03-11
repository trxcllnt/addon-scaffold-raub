'use strict';

const mkdir = require('./mkdir');
const write = require('./write');

// Addon root files
const tmpBindingGyp  = require('./templates/binding-gyp-deps');
const tmpPackageJson = require('./templates/package-json-deps');
const tmpReadmeMd    = require('./templates/readme-md-deps');
const tmpIndexJs     = require('./templates/index-js-deps');


const dirs = [
	'bin-win32', 'bin-win64',
	'bin-linux32', 'bin-linux64',
	'bin-mac64',
	'examples', 'test',
];


module.exports = async (json, opts) => {
	
	opts = { ...opts };
	
	for (const nested of dirs) {
		await mkdir(`${opts.dir}/${nested}`);
	}
	
	
	const templates = {
		
		[`${opts.dir}/binding.gyp`]  : tmpBindingGyp,
		[`${opts.dir}/package.json`] : tmpPackageJson,
		[`${opts.dir}/readme.md`]    : tmpReadmeMd,
		[`${opts.dir}/index.js`]     : tmpIndexJs,
		
		[`${opts.dir}/examples/.keep`]   : () => '',
		[`${opts.dir}/test/.keep`]       : () => '',
		
	};
	
	dirs.forEach(dir => templates[`${opts.dir}/${dir}/.keep`] = () => '');
	
	await Promise.all(Object.entries(templates).map(
		([file, tpl]) => write(file, tpl(opts)))
	);
	
};
