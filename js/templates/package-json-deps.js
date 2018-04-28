module.exports = opts => `\
{
	"author": "${opts.author} <${opts.email}>",
	"name": "deps-${opts.lower}-${opts.gitid}",
	"version": "0.0.1",
	"description": "${opts.desc}",
	"license": "MIT",
	"main": "index.js",
	"keywords": [
		"dependency",
		"${opts.lower}"
	],
	"engines": {
		"node": ">=8.11.1",
		"npm": ">=5.6.0"
	},
	"maintainers": [
		{
			"name": "${opts.author}",
			"email": "${opts.email}"
		}
	],
	"repository": {
		"type": "git",
		"url": "https://github.com/${opts.gitid}/node-deps-${opts.lower}"
	},
	"dependencies": {
		"addon-tools-raub": "0.1.8"
	}
}
`;
