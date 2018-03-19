module.exports = opts => `\
#include <cstdlib>
#include <iostream>
${ opts.inherits && opts.inherits.name === 'EventEmitter' ?
	'\n#include <event-emitter.hpp>\n'
	:
	(opts.inherits ? `\n#include "${opts.inherits.lower}.hpp"\n` : '')
}
#include "${opts.lower}.hpp"


using namespace v8;
using namespace node;
using namespace std;


// ------ Aux macros

#define THIS_${opts.upper}                                                    \\
	${opts.name} *${opts.inst} = ObjectWrap::Unwrap<${opts.name}>(info.This());

#define THIS_CHECK                                                            \\
	if (${opts.inst}->_isDestroyed) return;

#define DES_CHECK                                                             \\
	if (_isDestroyed) return;

#define CACHE_CAS(CACHE, V)                                                   \\
	if (${opts.inst}->CACHE == V) {                                           \\
		return;                                                               \\
	}                                                                         \\
	${opts.inst}->CACHE = V;


// ------ Methods and props

${opts.methods.map(m => `\

NAN_METHOD(${opts.name}::${m.name}) { THIS_${opts.upper}; THIS_CHECK;
	
	${m.params.map((p, i) => `REQ_${p.mtype}_ARG(${i}, ${p.name});`).join('\n\t')}
	
	// TODO: do something?
	
}
`).join('\n')}

${opts.properties.map(p => `\

NAN_GETTER(${opts.name}::${p.name}Getter) { THIS_${opts.upper}; THIS_CHECK;
	
	RET_VALUE(JS_${p.mtype}(${opts.inst}->_${p.name}));
	
}
${p.readonly ? '' : `
NAN_SETTER(${opts.name}::${p.name}Setter) { THIS_${opts.upper}; THIS_CHECK; SETTER_${p.mtype}_ARG;
	
	${ p.toV8 ? p.toV8(opts.inst, p.name) : `CACHE_CAS(_${p.name}, v);` }
	
	// TODO: may be additional actions on change?
	${ opts.isEmitter ? `\n\t${opts.inst}->emit("${p.name}", 1, &value);\n\t` : ''}
}`}
`).join('\n')}


// ------ System methods and props for ObjectWrap

Nan::Persistent<v8::FunctionTemplate> ${opts.name}::_protorype;
Nan::Persistent<v8::Function> ${opts.name}::_constructor;


void ${opts.name}::init(Local<Object> target) {
	
	Local<FunctionTemplate> proto = Nan::New<FunctionTemplate>(newCtor);
	
	${ opts.inherits ? `// class ${opts.name} inherits ${opts.inherits.name}
	Local<FunctionTemplate> parent = Nan::New(${opts.inherits.name}::_protorype);
	proto->Inherit(parent);` : ''
	}
	
	proto->InstanceTemplate()->SetInternalFieldCount(1);
	proto->SetClassName(JS_STR("${opts.name}"));
	
	
	// Accessors
	Local<ObjectTemplate> obj = proto->PrototypeTemplate();
	ACCESSOR_R(obj, isDestroyed);
	
	${opts.properties.map(p => `ACCESSOR_R${p.readonly ? '' : 'W'}(obj, ${p.name});`).join('\n\t')}
	
	// -------- dynamic
	
	Nan::SetPrototypeMethod(proto, "destroy", destroy);
	
	${opts.methods.map(m => `Nan::SetPrototypeMethod(proto, "${m.name}", ${m.name});`).join('\n\t')}
	
	// -------- static
	
	Local<Function> ctor = Nan::GetFunction(proto).ToLocalChecked();
	
	_protorype.Reset(proto);
	_constructor.Reset(ctor);
	
	Nan::Set(target, JS_STR("${opts.name}"), ctor);
	
	
}


NAN_METHOD(${opts.name}::newCtor) {
	${ opts.inherits ? `\n\t// 
	v8::Local<v8::Function> superCtor = Nan::New(${opts.inherits.name}::_constructor);
	superCtor->Call(info.This(), 0, nullptr);\n\t` : ''
	}
	${opts.name} *${opts.inst} = new ${opts.name}();
	${opts.inst}->Wrap(info.This());
	
	RET_VALUE(info.This());
	
}


${opts.name}::${opts.name}() {
	${ opts.inherits ? '' : `\n\t_isDestroyed = false;\n\t` }
}


${opts.name}::~${opts.name}() {
	${ opts.inherits ? '' : `\n\t_destroy();\n\t` }
}

${ opts.inherits ? '' : `\

void ${opts.name}::_destroy() { DES_CHECK;
	
	_isDestroyed = true;
	
	${ opts.isEmitter ? `emit("destroy");` : ''}
	
}


NAN_METHOD(${opts.name}::destroy) { THIS_${opts.upper}; THIS_CHECK;
	
	${opts.inst}->_destroy();
	
}


NAN_GETTER(${opts.name}::isDestroyedGetter) { THIS_${opts.upper};
	
	RET_VALUE(JS_BOOL(${opts.inst}->_isDestroyed));
	
}
`}
`;
