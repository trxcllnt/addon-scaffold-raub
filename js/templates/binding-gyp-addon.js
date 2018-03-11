module.exports = opts => `\
{
	'variables': {
		'rm'    : '<!(node -e "require(\\'addon-tools-raub\\').rm()")',
		'cp'    : '<!(node -e "require(\\'addon-tools-raub\\').cp()")',
		'mkdir' : '<!(node -e "require(\\'addon-tools-raub\\').mkdir()")',
	},
	'targets': [
		{
			'target_name': '${opts.lower}',
			'sources': [
				'cpp/bindings.cpp',
				${opts.classList.map(c => `'cpp/${c.lower}.cpp',`).join('\n\t\t\t\t')}
			],
			'include_dirs': [
				'<!@(node -e "require(\\'addon-tools-raub\\').include()")',
			],
			'library_dirs': [ ],
			'libraries'    : [ ],
			'conditions'   : [
				[
					'OS=="linux"', {
						'libraries': [
							# '-Wl,-rpath,<(TODO)',
						],
					}
				],
				[
					'OS=="mac"', {
						'libraries': [
							# '-Wl,-rpath,<(TODO)',
						],
					}
				],
				[
					'OS=="win"',
					{
						'msvs_settings' : {
							'VCCLCompilerTool' : {
								'AdditionalOptions' : [
									'/O2','/Oy','/GL','/GF','/Gm-', '/Fm-',
									'/EHsc','/MT','/GS','/Gy','/GR-','/Gd',
								]
							},
							'VCLinkerTool' : {
								'AdditionalOptions' : ['/RELEASE','/OPT:REF','/OPT:ICF','/LTCG']
							},
						},
					},
				],
			],
		},
		{
			'target_name'  : 'make_directory',
			'type'         : 'none',
			'dependencies' : ['${opts.lower}'],
			'actions'      : [{
				'action_name' : 'Directory created.',
				'inputs'      : [],
				'outputs'     : ['build'],
				'action': ['<(mkdir)', '-p', 'binary']
			}],
		},
		{
			'target_name'  : 'copy_binary',
			'type'         : 'none',
			'dependencies' : ['make_directory'],
			'actions'      : [{
				'action_name' : 'Module copied.',
				'inputs'      : [],
				'outputs'     : ['binary'],
				'action'      : ['<(cp)', 'build/Release/${opts.lower}.node', 'binary/${opts.lower}.node'],
			}],
		},
		{
			'target_name'  : 'remove_extras',
			'type'         : 'none',
			'dependencies' : ['copy_binary'],
			'actions'      : [{
				'action_name' : 'Build intermediates removed.',
				'inputs'      : [],
				'outputs'     : ['cpp'],
				'conditions'  : [
					[ 'OS=="linux"', { 'action' : [
						'rm',
						'<(module_root_dir)/build/Release/obj.target/${opts.lower}/cpp/${opts.lower}.o',
						'<(module_root_dir)/build/Release/obj.target/${opts.lower}.node',
						'<(module_root_dir)/build/Release/${opts.lower}.node'
					] } ],
					[ 'OS=="mac"', { 'action' : [
						'rm',
						'<(module_root_dir)/build/Release/obj.target/${opts.lower}/cpp/bindings.o',
						${
							opts.classList.map(
								c => `'<(module_root_dir)/build/Release/obj.target/${opts.lower}/cpp/${c.lower}.o',`
							).join('\n\t\t\t\t\t\t')
						}
						'<(module_root_dir)/build/Release/${opts.lower}.node'
					] } ],
					[ 'OS=="win"', { 'action' : [
						'<(rm)',
						'<(module_root_dir)/build/Release/${opts.lower}.*',
						'<(module_root_dir)/build/Release/obj/${opts.lower}/*.*'
					] } ],
				],
			}],
		},
	]
}
`;
