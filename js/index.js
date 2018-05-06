'use strict';

const path = require('path');
const fs   = require('fs');

const mkdir = require('./mkdir');
const write = require('./write');

const tmpLicense   = require('./templates/license');
const tmpGitignore = require('./templates/gitignore');
const tmpNpmignore = require('./templates/npmignore');


const target = process.argv[process.argv.length - 1].replace(/(\.json)?$/, '.json');

const resolved = path.resolve(target).replace(/\\/g, '/');

const types = ['addon', 'deps'];


const getJson = () => {
	
	try {
		
		return require(resolved);
		
	} catch (e) {
		
		console.error(`File ${target} could not be read.`);
		console.error(e);
		
		return null;
		
	}
	
};


(async () => {
	
	try {
		
		const json = getJson();
		
		if ( ! json ) {
			return;
		}
		
		if (typeof json.type !== 'string' || json.type.length < 1) {
			throw new Error('Expected field "type" to be a string.');
		} else if (types.indexOf(json.type) < 0) {
			throw new Error(`Type "${json.type}" is not supported.`);
		}
		
		if (typeof json.name !== 'string' || json.name.length < 2) {
			throw new Error('Expected field "name" to be a string of at least 2 characters.');
		}
		
		if (typeof json.gitid !== 'string' || json.gitid.length < 2) {
			throw new Error('Expected field "gitid" to be a string of at least 2 characters.');
		}
		
		const noDesc = typeof json.desc !== 'string' || json.desc.length < 1;
		if (noDesc) {
			console.log('Field "desc" not found. Assuming "TODO(module description)".');
		}
		
		const noAuthor = typeof json.author !== 'string' || json.author.length < 1;
		if (noAuthor) {
			console.log('Field "author" not found. Assuming "John Doe".');
		}
		
		const noEmail = typeof json.email !== 'string' || json.email.length < 5;
		if (noEmail) {
			console.log('Field "email" not found. Assuming "todo@todo.todo".');
		}
		
		const name = json.name.toLowerCase();
		
		const opts = {
			
			name,
			
			module : name.replace(/[^a-z0-9]/gi, ''),
			lower  : name.replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, ''),
			upper  : name.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/^_+|_+$/g, ''),
			
			gitid  : json.gitid,
			desc   : noDesc ? 'TODO(module description)' : json.desc,
			author : noAuthor ? 'John Doe' : json.author,
			email  : noEmail ? 'todo@todo.todo' : json.email,
			
		};
		
		opts.dir = `node-${opts.lower}`;
		
		
		await mkdir(opts.dir);
		
		await write(`${opts.dir}/LICENSE`, tmpLicense(opts));
		await write(`${opts.dir}/.gitignore`, tmpGitignore(opts));
		await write(`${opts.dir}/.npmignore`, tmpNpmignore(opts));
		
		
		await require(`./${json.type}`)(json, opts);
		
	} catch (e) {
		console.error(e);
	}
	
})();
