module.exports = opts => `\
#include <cstdlib>

${opts.classList.map(c => `#include "${c.lower}.hpp"`).join('\n')}


using namespace v8;
using namespace node;
using namespace std;


extern "C" {


void init(Local<Object> target) {
	
	${opts.classList.map(c => `${c.name}::init(target);`).join('\n\t')}
	
}


NODE_MODULE(${opts.module}, init);


} // extern "C"
`;
