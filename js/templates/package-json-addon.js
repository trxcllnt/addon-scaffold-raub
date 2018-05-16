module.exports = opts => `\
{
	"author": "${opts.author} <${opts.email}>",
	"name": "${opts.lower}-${opts.gitid}",
	"version": "0.0.1",
	"description": "${opts.desc}",
	"license": "MIT",
	"main": "index.js",
	"keywords": [
		"addon",
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
		"url": "https://github.com/${opts.gitid}/${opts.lower}.git"
	},
	"dependencies": {
		"addon-tools-raub": "^2.0.1"
	}
}
`;
