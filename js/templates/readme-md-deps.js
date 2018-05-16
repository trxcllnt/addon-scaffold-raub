module.exports = opts => `\
# ${opts.name} binaries


## Synopsis

${opts.desc}

This dependency package is distributing ${opts.name}
binaries through **NPM** for **Node.js** addons.

* Platforms: win x32/x64, linux x32/x64, mac x64.
* Libraries: TODO(which).
* Linking: TODO(<static/dynamic> <dll/lib>-type).


## Install

\`npm i -s deps-${opts.lower}-${opts.gitid}\`


---

## Legal notice

TODO(describe licenses)

---

The rest of this package is MIT licensed.

---


## Usage

### binding.gyp

\`\`\`javascript
	'variables': {
		'${opts.lower}_include' : '<!(node -e "require(\'deps-${opts.lower}-${opts.gitid}\').include()")',
		'${opts.lower}_bin'     : '<!(node -e "require(\'deps-${opts.lower}-${opts.gitid}\').bin()")',
	},
	...
	'targets': [
		{
			'target_name': '...',
			
			'include_dirs': [
				'<(${opts.lower}_include)',
				...
			],
			
			'library_dirs': [ '<(${opts.lower}_bin)' ],
			
			'conditions': [
				
				['OS=="linux"', {
					'libraries': [
						'-Wl,-rpath,<(${opts.lower}_bin)',
						# TODO(libs)
					],
				}],
				
				['OS=="mac"', {
					'libraries': [
						'-Wl,-rpath,<(${opts.lower}_bin)',
						# TODO(libs)
					],
				}],
				
				['OS=="win"', {
					'libraries': [
						# TODO(libs)
					],
				}],
				
			],
		},
\`\`\`


### addon.cpp

\`\`\`cpp
// TODO(example)
#include <...>
\`\`\`
