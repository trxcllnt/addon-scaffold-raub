module.exports = opts => `\
#ifndef _${opts.upper}_HPP_
#define _${opts.upper}_HPP_


#include <${ opts.isEmitter ? 'event-emitter' : 'addon-tools' }.hpp>


class ${opts.name} : public ${ opts.isEmitter ? 'EventEmitter' : 'Nan::ObjectWrap' } {
	
// Public V8 init
public:
	
	static void init(v8::Local<v8::Object> target);
	
	
// Public C++ methods: in-engine calls
public:
	
	
// Protected C++ methods: implementing JS calls
protected:
	
	${opts.name}();
	virtual ~${opts.name}();
	
	
// JS methods and props
protected:
	
	static NAN_METHOD(newCtor);
	
	static NAN_METHOD(destroy);
	
	static NAN_GETTER(isDestroyedGetter);
	
	
// Actual destruction-handler
private:
	
	void _destroy();
	
	
// Stored JS constructor and helpers
private:
	
	static Nan::Persistent<v8::Function> _constructor;
	
	
// This-state storage
private:
	
	bool _isDestroyed;
	
};


#endif // _${opts.upper}_HPP_
`;
