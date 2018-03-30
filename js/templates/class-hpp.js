module.exports = opts => `\
#ifndef _${opts.upper}_HPP_
#define _${opts.upper}_HPP_

${
	opts.inherits && opts.inherits.name === 'EventEmitter' ?
		'\n#include <event-emitter.hpp>\n'
		:
		`\n#include <addon-tools.hpp>\n${
			(opts.inherits ? `\n#include "${opts.inherits.lower}.hpp"\n` : '')
		}`
}

class ${opts.name} : public ${(opts.inherits ? opts.inherits.name : 'Nan::ObjectWrap')} {
	
public:
	
	// Public V8 init
	static void init(V8_VAR_OBJ target);
	
	static bool is${opts.name}(V8_VAR_OBJ obj);
	
	// Make a new instance from C++ land
	static V8_VAR_OBJ getNew();
	
	// Destroy an instance from C++ land
	void _destroy();
	
	
// Methods and props, available for children
protected:
	
	${opts.name}();
	virtual ~${opts.name}();
	
	static V8_STORE_FT _proto${opts.name};
	static V8_STORE_FUNC _ctor${opts.name};
	
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
