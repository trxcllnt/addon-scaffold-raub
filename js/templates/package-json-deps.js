module.exports = opts => `\
{
	"name": "deps-${opts.lower}-${opts.gitid}",
	"author": "${opts.author} <${opts.email}>",
	"description": "${opts.desc}",
	"version": "0.0.1",
	"main": "index.js",
	"keywords": [
		"${opts.lower}",
		"binaries",
		"deps",
		"dependency",
		"addon",
		"compile",
		"lib",
		"dll",
		"so",
		"windows",
		"mac",
		"linux"
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
		"url": "https://github.com/${opts.gitid}/node-deps-${opts.lower}"
	},
	"dependencies": {
		"addon-tools-raub": "0.0.9"
	}
}
`;
