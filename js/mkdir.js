'use strict';

const fs   = require('fs');


module.exports = dir => new Promise(
	(res, rej) => fs.mkdir(
		dir,
		err => err ? (err.code === 'EEXIST' ? res() : rej(err)) : res()
	)
);
