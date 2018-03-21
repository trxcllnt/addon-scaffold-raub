module.exports = opts => `\
{
	"name": "${opts.lower}-${opts.gitid}",
	"version": "0.0.1",
	"description": "${opts.desc}",
	"main": "index.js",
	"author": "${opts.author} <${opts.email}>",
	"keywords": [
		"${opts.lower}",
		"addon",
		"compile"
	],
	"maintainers": [
		{
			"name": "${opts.author}",
			"email": "${opts.email}"
		}
	],
	"license": "MIT",
	"repository": {
		"type": "git",
		"url": "https://github.com/${opts.gitid}/node-${opts.lower}.git"
	},
	"dependencies": {
		"addon-tools-raub": "0.1.4"
	}
}
`;
