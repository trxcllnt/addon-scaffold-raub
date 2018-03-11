'use strict';

const mkdir = require('./mkdir');
const write = require('./write');

// Addon root files
const tmpBindingGyp  = require('./templates/binding-gyp-addon');
const tmpPackageJson = require('./templates/package-json-addon');
const tmpReadmeMd    = require('./templates/readme-md-addon');
const tmpIndexJs     = require('./templates/index-js-addon');
const tmpCoreJs      = require('./templates/core-js');

// C++ classes
const tmpBindingsCpp = require('./templates/bindings-cpp');
const tmpClassCpp    = require('./templates/class-cpp');
const tmpClassHpp    = require('./templates/class-hpp');


module.exports = async (json, opts) => {
	
	const noClasses = (
		typeof json.classes !== 'object' ||
		json.classes === null ||
		Object.keys(json.classes).length === 0
	);
	
	if (noClasses) {
		console.log('Field "classes" empty. None will be generated.');
	}
	
	opts = {
		
		...opts, // clone
		
		classList : noClasses ? [] : Object.entries(json.classes).map(
			([key, value]) => {
				
				const compacted = key.replace(/[^a-z0-9]/gi, '');
				const name      = compacted.replace(/^./, x => x.toUpperCase());
				const inst      = name.replace(/^./, x => x.toLowerCase());
				const lower     = inst.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`);
				const upper     = lower.replace(/-/g, '_').toUpperCase();
				const isEmitter = value.isEmitter === true;
				
				return { name, inst, lower, upper, isEmitter };
				
			}
		),
		
	};
	
	const dirs = ['cpp', 'examples', 'test'];
	
	for (const nested of dirs) {
		await mkdir(`${opts.dir}/${nested}`);
	}
	
	
	const templates = {
		
		[`${opts.dir}/binding.gyp`]  : tmpBindingGyp,
		[`${opts.dir}/package.json`] : tmpPackageJson,
		[`${opts.dir}/readme.md`]    : tmpReadmeMd,
		[`${opts.dir}/index.js`]     : tmpIndexJs,
		[`${opts.dir}/core.js`]      : tmpCoreJs,
		
		[`${opts.dir}/examples/.keep`]   : () => '',
		[`${opts.dir}/test/.keep`]       : () => '',
		[`${opts.dir}/cpp/bindings.cpp`] : tmpBindingsCpp,
		
	};
	
	await Promise.all(Object.entries(templates).map(
		([file, tpl]) => write(file, tpl(opts)))
	);
	
	
	await Promise.all(opts.classList.map(
		c => Promise.all([
			write(`${opts.dir}/cpp/${c.lower}.cpp`, tmpClassCpp(c)),
			write(`${opts.dir}/cpp/${c.lower}.hpp`, tmpClassHpp(c)),
		])
	));
	
	
};
