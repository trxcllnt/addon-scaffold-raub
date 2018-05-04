module.exports = opts => `\
#include <cstdlib>
${opts.hasEmitter ? '\n#include <event-emitter.hpp>\n' : ''}
${opts.classList.map(c => `#include "${c.lower}.hpp"`).join('\n')}


extern "C" {


void init(V8_VAR_OBJ target) {
	${opts.hasEmitter ? '\n\tEventEmitter::init(target);\n\t' : ''}
\t${
	opts.classList.sort(
		(a, b) => a.chain.length - b.chain.length
	).map(
		c => `${c.name}::init(target);`
	).join(
		'\n\t'
	)
}
	
}


NODE_MODULE(${opts.module}, init);


} // extern "C"
`;
