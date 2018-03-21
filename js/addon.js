'use strict';

const mkdir = require('./mkdir');
const write = require('./write');

const getType = require('./get-type');

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

const checkObjectKey = (obj, key) => (
	typeof obj[key] !== 'object' ||
	obj[key] === null ||
	Object.keys(obj[key]).length === 0
);


const eventEmitterDesc = {
	name  : 'EventEmitter',
	inst  : 'eventEmitter',
	lower : 'event-emitter',
	upper : 'EVENT_EMITTER',
};


module.exports = async (json, opts) => {
	
	const noClasses = checkObjectKey(json, 'classes');
	
	if (noClasses) {
		console.log('Field "classes" is empty. None will be generated.');
	}
	
	const classList = noClasses ? [] : Object.entries(json.classes).map(
		([key, value]) => {
			
			// Remove any non-letters
			const compacted = key.replace(/[^a-z0-9]/gi, '');
			
			// Check if starts with a letter or not
			if (/^[^a-z]/i.test(compacted)) {
				throw new Error(`Class name must start with a letter. Got "${key}" instead.`);
			}
			
			// First letter: class name - upper, instance name - lower
			const name = compacted.replace(/^./, x => x.toUpperCase());
			const inst = name.replace(/^./, x => x.toLowerCase());
			
			// lower-case-notation-for-file-names
			const lower = name.replace(
				/[A-Z]+[A-Z]/g, x => `${x[0]}${x.slice(1, -1).toLowerCase()}${x[x.length-1]}`
			).replace(
				/^./, x => x.toLowerCase()
			).replace(
				/[a-z][A-Z]/g, x => `${x[0].toLowerCase()}-${x[1].toLowerCase()}`
			);
			
			// UPPER_CASE_NOTATION_FOR_MACROS 
			const upper = lower.replace(/-/g, '_').toUpperCase();
			
			
			// -------- Methods
			
			const noMethods = checkObjectKey(value, 'methods');
			
			const methods = noMethods ? [] : Object.entries(value.methods).map(
				(pair) => {
					
					const [name, params] = pair;
					const noParams = checkObjectKey(pair, 1);
					
					return {
						name,
						params : noParams ? [] : Object.entries(params).map(
							([name, ltype]) => ({ ...getType(ltype), name })
						),
					};
					
				}
			);
			
			
			// -------- Properties
			
			const noProperties = checkObjectKey(value, 'properties');
			
			const properties = noProperties ? [] : Object.entries(value.properties).map(
				([qualifiedName, ltype]) => {
					const readonly = qualifiedName.indexOf('-') === 0;
					const name = qualifiedName.replace(/[^a-z0-9]/gi, '');
					return { ...getType(ltype), name, readonly };
				}
			);
			
			const inherits = value.inherits;
			const children = [];
			
			return { name, inst, lower, upper, methods, properties, inherits, children };
			
		}
	);
	
	const classes = {};
	classList.forEach(c => classes[c.name] = c);
	classList.forEach(c => {
		
		if (c.inherits === 'EventEmitter') {
			c.inherits = eventEmitterDesc;
		} else if (c.inherits) {
			c.inherits = classes[c.inherits];
			c.inherits.children.push(c);
		}
		
	});
	classList.forEach(c => {
		c.hasEmitter = (function _re(next) {
			if ( ! next.inherits ) {
				return false;
			}
			return next.inherits.name === 'EventEmitter' ? true : _re(next.inherits);
		})(c);
	});
	
	
	opts = { ...opts, classList };
	
	
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
	
	
	// Write all non-repeating files
	await Promise.all(Object.entries(templates).map(
		([file, tpl]) => write(file, tpl(opts)))
	);
	
	// Write C++ classes
	await Promise.all(opts.classList.map(
		c => Promise.all([
			write(`${opts.dir}/cpp/${c.lower}.cpp`, tmpClassCpp(c)),
			write(`${opts.dir}/cpp/${c.lower}.hpp`, tmpClassHpp(c)),
		])
	));
	
};
