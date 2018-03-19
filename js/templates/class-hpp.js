module.exports = opts => `\
#ifndef _${opts.upper}_HPP_
#define _${opts.upper}_HPP_


#include <addon-tools.hpp>


class ${opts.name} : public Nan::ObjectWrap {
	${opts.children.length === 0 ? '' : `
	${opts.children.map(c => `friend class ${c.name};`).join('\n\t')}
	`}
// Methods and props
private:
	
	${opts.methods.map(m => `static NAN_METHOD(${m.name});`).join('\n\t')}
	${opts.properties.map(p => `
	static NAN_GETTER(${p.name}Getter);${p.readonly ? '' : `
	static NAN_SETTER(${p.name}Setter);`}
	`).join('')}
	
	${opts.properties.map(p => `${p.ctype} _${p.name};`).join('\n\t')}
	
// Public V8 init
public:
	
	static void init(v8::Local<v8::Object> target);
	
	
// System methods and props for ObjectWrap
private:
	
	${opts.name}();
	virtual ~${opts.name}();
	
	static NAN_METHOD(newCtor);
	
	static Nan::Persistent<v8::FunctionTemplate> _protorype; // for inheritance
	static Nan::Persistent<v8::Function> _constructor;
	
	${ opts.inherits ? '' : `\
	static NAN_METHOD(destroy);
	static NAN_GETTER(isDestroyedGetter);
	void _destroy();
	bool _isDestroyed;`
	}
	
};


#endif // _${opts.upper}_HPP_
`;
