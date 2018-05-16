module.exports = opts => `\
'use strict';

// Add deps dll dirs
// require('deps-${opts.lower}');

const { binPath } = require('addon-tools-raub');

const core = require(\`./$\{binPath}/${opts.lower}\`);


module.exports = core;
`;
