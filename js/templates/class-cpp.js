module.exports = opts => `\
#include <cstdlib>
#include <iostream>

#include "${opts.lower}.hpp"

using namespace v8;
using namespace node;
using namespace std;


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


Nan::Persistent<v8::Function> ${opts.name}::_constructor;


void ${opts.name}::init(Local<Object> target) {
	
	Local<FunctionTemplate> proto = Nan::New<FunctionTemplate>(newCtor);
	
	proto->InstanceTemplate()->SetInternalFieldCount(1);
	proto->SetClassName(JS_STR("${opts.name}"));
	
	
	// Accessors
	Local<ObjectTemplate> obj = proto->PrototypeTemplate();
	ACCESSOR_R(obj, isDestroyed);
	
	
	// -------- dynamic
	
	${ opts.isEmitter ? 'extendPrototype(proto);' : '' }
	
	Nan::SetPrototypeMethod(proto, "destroy", destroy);
	
	
	// -------- static
	
	Local<Function> ctor = Nan::GetFunction(proto).ToLocalChecked();
	
	${ opts.isEmitter ? 'extendConstructor(ctor);' : '' }
	
	
	_constructor.Reset(ctor);
	Nan::Set(target, JS_STR("${opts.name}"), ctor);
	
	
}


NAN_METHOD(${opts.name}::newCtor) {
	
	CTOR_CHECK("${opts.name}");
	
	${opts.name} *${opts.inst} = new ${opts.name}();
	${opts.inst}->Wrap(info.This());
	
	RET_VALUE(info.This());
	
}


${opts.name}::${opts.name}() {
	
	_isDestroyed = false;
	
}


${opts.name}::~${opts.name}() {
	
	_destroy();
	
}


void ${opts.name}::_destroy() { DES_CHECK;
	
	_isDestroyed = true;
	
	${ opts.isEmitter ? `emit("destroy");` : ''}
	
}



NAN_METHOD(${opts.name}::destroy) { THIS_${opts.upper}; THIS_CHECK;
	
	${opts.inst}->_destroy();
	
}

${opts.methods.map(m => `\

NAN_METHOD(${opts.name}::${m.name}) { THIS_${opts.upper}; THIS_CHECK;
	
	${m.params.map((p, i) => `REQ_${p.mtype}_ARG(${i}, ${p.name});`).join('\n\t')}
	
	// TODO: do something?
	
}
`).join('\n')}


NAN_GETTER(${opts.name}::isDestroyedGetter) { THIS_${opts.upper};
	
	RET_VALUE(JS_BOOL(${opts.inst}->_isDestroyed));
	
}

${opts.properties.map(p => `\

NAN_GETTER(${opts.name}::${p.name}Getter) { THIS_${opts.upper}; THIS_CHECK;
	
	RET_VALUE(JS_${p.mtype}(${opts.inst}->_${p.name}));
	
}

NAN_SETTER(${opts.name}::${p.name}Setter) { THIS_${opts.upper}; THIS_CHECK; SETTER_${p.mtype}_ARG;
	
	${ p.toV8 ? p.toV8(opts.inst, p.name) : `CACHE_CAS(_${p.name}, v);` }
	
	// TODO: may be additional actions on change?
	${ opts.isEmitter ? `\n\t${opts.inst}->emit("${p.name}", 1, &value);\n\t` : ''}
}
`).join('\n')}
`;
