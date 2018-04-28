module.exports = opts => `\
# ${opts.name}

${opts.desc}


## Install

\`\`\`
npm i -s ${opts.lower}-${opts.gitid}
\`\`\`

> Note: compilation tools must be in place on your system.
Such as MSVS13 for Windows, where **ADMIN PRIVELEGED**
\`npm i -g windows-build-tools\` most probably helps.
Also Windows needs **vcredist 2013** to be installed.


## Usage

TODO(howto)


${opts.classList.map(c => `

---

### class ${c.name}${(opts.inherits ? ` : ${opts.inherits.name}` : '')}

TODO(description)

\`\`\`
const { ${c.name} } = require('${opts.lower}-${opts.gitid}');
const ${c.inst} = new ${c.name}();
\`\`\`


Constructor:
* \`${c.name}()\`


Properties:
* \`get bool isDestroyed\` - if \`destroy()\` was called on this instance.
${
	c.properties.map(
		p => `* \`get${p.readonly ? '' : '/set'} ${p.jtype} ${p.name}\` - TODO(description).`
	).join('\n')
}


Methods:
* \`void destroy()\` - destroys the instance${c.hasEmitter ? ', `\'destroy\'` event is emitted' : ''}.
${
	c.methods.map(m => `* \`void ${m.name}(${
		m.params.map(p => `${p.jtype} ${p.name}`).join(', ')
	})\` - TODO(description).`).join('\n')
}


${c.hasEmitter ? `\
Events:
* \`'destroy' <>\` - emitted when the instance was destroyed.
${c.properties.map(p => `* \`'${p.name}' <${p.jtype}>\` - emitted when the property was changed.`).join('\n')}
` : ''
}\
\
`).join('\n')}
`;
