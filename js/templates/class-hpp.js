module.exports = opts => `\
#ifndef _${opts.upper}_HPP_
#define _${opts.upper}_HPP_

${ opts.inherits && opts.inherits.name === 'EventEmitter' ?
	'\n#include <event-emitter.hpp>\n'
	:
	`\n#include <addon-tools.hpp>\n${(opts.inherits ? `\n#include "${opts.inherits.lower}.hpp"\n` : '')}`
}

class ${opts.name} : public ${(opts.inherits ? opts.inherits.name : 'Nan::ObjectWrap')} {
	
public:
	
	// Public V8 init
	static void init(v8::Local<v8::Object> target);
	
	void _destroy();
	
	
// Methods and props, available for children
protected:
	
	${opts.name}();
	virtual ~${opts.name}();
	
	static Nan::Persistent<v8::FunctionTemplate> _proto${opts.name}; // for inheritance
	static Nan::Persistent<v8::Function> _ctor${opts.name};
	
	bool _isDestroyed;
	
	${opts.properties.map(p => `${p.ctype} _${p.name};`).join('\n\t')}
	
	
// JS methods and props, available through V8 APIs
private:
	
	static NAN_METHOD(newCtor);
	
	static NAN_METHOD(destroy);
	static NAN_GETTER(isDestroyedGetter);
	
	${opts.methods.map(m => `static NAN_METHOD(${m.name});`).join('\n\t')}
	${opts.properties.map(p => `
	static NAN_GETTER(${p.name}Getter);${p.readonly ? '' : `
	static NAN_SETTER(${p.name}Setter);`}
	`).join('')}
};


#endif // _${opts.upper}_HPP_
`;
