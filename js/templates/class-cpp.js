module.exports = opts => `\
#include <cstdlib>


#include "${opts.lower}.hpp"


using namespace v8;
using namespace node;
using namespace std;


// ------ Aux macros

#define THIS_${opts.upper}                                                    \\
	${opts.name} *${opts.inst} = Nan::ObjectWrap::Unwrap<${opts.name}>(info.This());

#define THIS_CHECK                                                            \\
	if (${opts.inst}->_isDestroyed) return;

#define CACHE_CAS(CACHE, V)                                                   \\
	if (${opts.inst}->CACHE == V) {                                           \\
		return;                                                               \\
	}                                                                         \\
	${opts.inst}->CACHE = V;


// ------ Constructor and Destructor

${opts.name}::${opts.name}()${ opts.inherits ? ` :
${opts.inherits.name}()` : '' } {
	
	_isDestroyed = false;
	
}


${opts.name}::~${opts.name}() {
	
	_destroy();
	
}


void ${opts.name}::_destroy() { DES_CHECK;
	
	_isDestroyed = true;
	${ opts.inherits ? `\n\t${opts.inherits.name}::_destroy();\n\t` : '' }
}


// ------ Methods and props


${opts.methods.map(m => `\
NAN_METHOD(${opts.name}::${m.name}) { THIS_${opts.upper}; THIS_CHECK;
	${m.params.length === 0 ? '' : `
	${m.params.map((p, i) => `REQ_${p.mtype}_ARG(${i}, ${p.name});`).join('\n\t')}
	`}
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
	${ opts.hasEmitter ? `\n\t${opts.inst}->emit("${p.name}", 1, &value);\n\t` : ''}
}
`}
`).join('\n')}
// ------ System methods and props for ObjectWrap

V8_STORE_FT ${opts.name}::_proto${opts.name};
V8_STORE_FUNC ${opts.name}::_ctor${opts.name};


void ${opts.name}::init(V8_VAR_OBJ target) {
	
	V8_VAR_FT proto = Nan::New<FunctionTemplate>(newCtor);
${ opts.inherits ? `\n\t// class ${opts.name} inherits ${opts.inherits.name}
	V8_VAR_FT parent = Nan::New(${opts.inherits.name}::_proto${opts.inherits.name});
	proto->Inherit(parent);\n\t` : ''
}
	proto->InstanceTemplate()->SetInternalFieldCount(1);
	proto->SetClassName(JS_STR("${opts.name}"));
	
	
	// Accessors
	V8_VAR_OT obj = proto->PrototypeTemplate();
	ACCESSOR_R(obj, isDestroyed);
	
	${opts.properties.map(p => `ACCESSOR_R${p.readonly ? '' : 'W'}(obj, ${p.name});`).join('\n\t')}
	
	// -------- dynamic
	
	Nan::SetPrototypeMethod(proto, "destroy", destroy);
	
	${opts.methods.map(m => `Nan::SetPrototypeMethod(proto, "${m.name}", ${m.name});`).join('\n\t')}
	
	// -------- static
	
	V8_VAR_FUNC ctor = Nan::GetFunction(proto).ToLocalChecked();
	
	_proto${opts.name}.Reset(proto);
	_ctor${opts.name}.Reset(ctor);
	
	Nan::Set(target, JS_STR("${opts.name}"), ctor);
	
	
}


bool ${opts.name}::is${opts.name}(V8_VAR_OBJ obj) {
	return Nan::New(_proto${opts.name})->HasInstance(obj);
}


V8_VAR_OBJ ${opts.name}::getNew() {
	
	V8_VAR_FUNC ctor = Nan::New(_ctor${opts.name});
	// V8_VAR_VAL argv[] = { /* arg1, arg2, ... */ };
	return Nan::NewInstance(ctor, 0/*argc*/, nullptr/*argv*/).ToLocalChecked();
	
}


NAN_METHOD(${opts.name}::newCtor) {
	
	CTOR_CHECK("${opts.name}");
	
	${opts.name} *${opts.inst} = new ${opts.name}();
	${opts.inst}->Wrap(info.This());
	
	RET_VALUE(info.This());
	
}


NAN_METHOD(${opts.name}::destroy) { THIS_${opts.upper}; THIS_CHECK;
	${ opts.hasEmitter ? `\n\t${opts.inst}->emit("destroy");\n\t` : ''}
	${opts.inst}->_destroy();
	
}


NAN_GETTER(${opts.name}::isDestroyedGetter) { THIS_${opts.upper};
	
	RET_VALUE(JS_BOOL(${opts.inst}->_isDestroyed));
	
}
`;
