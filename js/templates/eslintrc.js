module.exports = () => `\
{
	"root": true,
	"env": {
		"node"     : true,
		"es6"      : true,
		"mocha"    : true
	},
	"globals": {
		"expect" : true,
		"chai"   : true,
		"sinon"  : true
	},
	"extends": ["eslint:recommended"],
	"parserOptions": {
		"ecmaVersion": 8,
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true
		}
	},
	"rules": {
		"arrow-parens": ["error", "as-needed"],
		"no-trailing-spaces": [
			"error",
			{
				"skipBlankLines": true
			}
		],
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"max-len": ["error", 110],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-multiple-empty-lines": ["error", { "max": 3, "maxEOF": 1, "maxBOF": 1 }],
		"keyword-spacing": ["error", { "before": true, "after": true }],
		"space-before-blocks": ["error"],
		"space-before-function-paren": ["error", {"anonymous": "always", \
"named": "never", "asyncArrow": "always"}],
		"space-infix-ops": ["error"],
		"space-unary-ops": [
			"error", {
				"words": true,
				"nonwords": false,
				"overrides": {
					"!": true
				}
			}
		],
		"spaced-comment": [0],
		"camelcase": ["error"],
		"no-tabs": [0],
		"comma-dangle": [0],
		"global-require": [0],
		"func-names": [0],
		"no-param-reassign": [0],
		"no-underscore-dangle": [0],
		"no-restricted-syntax": [
			"error",
			{
				"selector": "LabeledStatement",
				"message": "Labels are a form of GOTO; using them makes code \
confusing and hard to maintain and understand."
			},
			{
				"selector": "WithStatement",
				"message": "\`with\` is disallowed in strict mode because it \
makes code impossible to predict and optimize."
			}
		],
		"no-mixed-operators": [0],
		"no-plusplus": [0],
		"comma-spacing": [0],
		"default-case": [0],
		"no-shadow": [0],
		"no-console": [0],
		"key-spacing": [0],
		"no-return-assign": [0],
		"consistent-return": [0],
		"class-methods-use-this": [0],
		"no-multi-spaces": [
			"error", 
			{
				"exceptions": { 
					"VariableDeclarator": true,
					"Property": true,
					"ImportDeclaration": true
				} 
			}
		],
		"array-callback-return": [0],
		"no-use-before-define": [
			"error",
			{
				"functions": false,
				"classes": true,
				"variables": true
			}
		],
		"padded-blocks": [0],
		"space-in-parens": [0],
		"valid-jsdoc": [0],
		"no-unused-expressions": [0],
		"import/no-dynamic-require": [0]
	}
}
`;
