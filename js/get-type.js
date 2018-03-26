'use strict';


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
		ctype: 'V8_STORE_FUNC',
		jtype: 'function',
		toV8: toPersistentV8,
	},
	obj : {
		ctype: 'V8_STORE_OBJ',
		jtype: 'object',
		toV8: toPersistentV8,
	},
	
};

module.exports = ltype => {
	
	if ( ! types[ltype] ) {
		throw new Error(`Unsupported data type: "${ltype}"`);
	}
	
	return {
		...types[ltype],
		ltype,
		mtype : ltype.toUpperCase(),
	};
	
};
