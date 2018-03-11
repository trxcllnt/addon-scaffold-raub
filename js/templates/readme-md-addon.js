module.exports = opts => `\
# ${opts.name}

${opts.desc}


## Install

\`\`\`
npm i -s ${opts.lower}-${opts.gitid}
\`\`\`

Note: as this is a compiled addon, compilation tools must be in place on your system.
Such as MSVS13 for Windows, where **ADMIN PRIVELEGED**
\`npm i -g windows-build-tools\` most probably helps.


## Usage

TODO(howto)


${opts.classList.map(c => `

---

### class ${c.name}

TODO(description)

\`\`\`
const { ${c.name} } = require('${opts.lower}-${opts.gitid}');
const ${c.inst} = new ${c.name}();
\`\`\`


Constructor:
* \`${c.name}()\`


Properties:
* \`get bool isDestroyed false\` - see if \`destroy()\` was called on this instance.


Methods:
* \`void destroy()\` - destroys the instance${c.isEmitter ? ', `\'destroy\'` event is emitted' : ''}.


Events:
* \`'destroy'\` - emitted when the scene is destroyed.

`).join('\n')}
`;
