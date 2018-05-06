# Addon Scaffold

This is a part of [Node3D](https://github.com/node-3d) project.


## Synopsis

Generates either a dependency-module or a compiled-module from JSON description.
The resulting modules can be further specified and developed by hand and
then published to NPM. Install **globally**, because there is no point installing
it locally.


## Install

`npm i -g addon-scaffold-raub`


## Usage

`addon-scaffold description.json` - scaffolds into the current directory.

`addon-scaffold description` - file extension is optional.


---

In JSON there are several parameters, that define an outcome:

* `type` - "addon" or "deps", is required.
* `name` - module name, is required.
* `gitid` - git user name, is required.

* `desc` - short module summary, defaults to "TODO(module description)".
* `author` - name of the author, defaults to "John Doe".
* `email` - email of the author, defaults to "todo@todo.todo".


---

Additionally, `"addon"` description can have a parameter, named `"classes"`. If so,
it should be a nested object, containing a whole list of classes to be generated
for the addon.

```
	"classes" : {
		"Class1" : {
			"inherits" : "EventEmitter",
			"properties" : {
				"k1": "bool",
				"-k2": "fun",
				"-k3": "uint32"
			}
		},
		"Class2" : {
			"methods" : {
				"f1" : { "p1": "int32", "p2": "utf8", "p3": "float", "p4": "obj" }
			}
		},
		"Class3" : {
			"inherits" : "Class1",
		}
	}
```

Here the keys of `"classes"` object are the names of the classes to be generated.
Each class has a set of **optional** arguments:

* `"inherits"` - a string containing parent class name:
	* could be one of classes defined in this JSON
	* could be `EventEmitter` (C++ impl, imported from `addon-tools-raub`)
* `"methods"` - a nested object with per-method definitions:
	* key - method name,
	* value - a nested object with per-parameter definitions:
		* key - parameter name,
		* value - parameter type.
* `"properties"` - a nested object with per-property definitions:
	* key - property name, it can be prepended with `-` to make it **read-only**
	* value - property type.

Available types are:

* `bool` - boolean.
* `utf8` - unicode string.
* `int32` - integer.
* `uint32` - unsigned integer.
* `offs` - pointer-size integer (int64 for x64).
* `double` - double precision float.
* `float` - single precision float.
* `ext` - external pointer.
* `fun` - function.
* `obj` - object.


## Additional Notes

The [addon-tools-raub](https://github.com/node-3d/addon-tools-raub)
package is used inside the templates.

