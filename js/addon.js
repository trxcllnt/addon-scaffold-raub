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


const dirs = ['cpp', 'examples', 'test'];

const toPersistentV8 = (inst, name) => `if (Nan::New(${inst}->_${name}) == v) {
		return;
	}
	${inst}->_${name}.Reset(v);\
`;

const toStringV8 = (inst, name) => `if (${inst}->_${name} == *v) {
		return;
	}
	${inst}->_${name} = *v;\
`;

const types = {
	
	int32  : {
		ctype: 'int',
		jtype: 'number',
	},
	bool   : {
		ctype: 'bool',
		jtype: 'boolean',
	},
	uint32 : {
		ctype: 'unsigned int',
		jtype: 'number',
	},
	offs   : {
		ctype: 'size_t',
		jtype: 'number',
	},
	double : {
		ctype: 'double',
		jtype: 'number',
	},
	float  : {
		ctype: 'float',
		jtype: 'number',
	},
	ext    : {
		ctype: 'void *',
		jtype: 'object',
	},
	
	utf8 : {
		ctype: 'std::string',
		jtype: 'string',
		toV8: toStringV8,
	},
	fun : {
		ctype: 'Nan::Persistent<v8::Function>',
		jtype: 'function',
		toV8: toPersistentV8,
	},
	obj : {
		ctype: 'Nan::Persistent<v8::Object>',
		jtype: 'object',
		toV8: toPersistentV8,
	},
	
};

const getType = ltype => (types[ltype] || (() =>{throw new Error(`Unsupported data type: "${ltype}"`);})());


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
				const lower     = name.replace(
					/[A-Z]+[A-Z]/g, x => `${x[0]}${x.slice(1, -1).toLowerCase()}${x[x.length-1]}`
				).replace(
					/^./, x => x.toLowerCase()
				).replace(
					/[a-z][A-Z]/g, x => `${x[0].toLowerCase()}-${x[1].toLowerCase()}`
				);
				const upper     = lower.replace(/-/g, '_').toUpperCase();
				const isEmitter = value.isEmitter === true;
				
				const noMethods = (
					typeof value.methods !== 'object' ||
					value.methods === null ||
					Object.keys(value.methods).length === 0
				);
				
				const methods = noMethods ? [] : Object.entries(value.methods).map(
					([name, params]) => {
						
						const noParams = (
							typeof params !== 'object' ||
							params === null ||
							Object.keys(params).length === 0
						);
						
						return {
							name,
							params : noParams ? [] : Object.entries(params).map(
								([name, ltype]) => {
									const type = getType(ltype);
									return {
										...type,
										name,
										ltype,
										mtype : ltype.toUpperCase(),
									};
								}
							),
						};
					}
				);
				
				
				const noProperties = (
					typeof value.properties !== 'object' ||
					value.properties === null ||
					Object.keys(value.properties).length === 0
				);
				
				const properties = noProperties ? [] : Object.entries(value.properties).map(
					([name, ltype]) => {
						const type = getType(ltype);
						return {
							...type,
							name,
							ltype,
							mtype : ltype.toUpperCase(),
						};
					}
				);
				
				
				return { name, inst, lower, upper, isEmitter, methods, properties };
				
			}
		),
		
	};
	
	
	for (const nested of dirs) {
		await mkdir(`${opts.dir}/${nested}`);
	}
	
	
	const templates = {
		
		[`${opts.dir}/binding.gyp`]  : tmpBindingGyp,
		[`${opts.dir}/package.json`] : tmpPackageJson,
		[`${opts.dir}/README.md`]    : tmpReadmeMd,
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
