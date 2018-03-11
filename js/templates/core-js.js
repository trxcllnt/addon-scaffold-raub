module.exports = opts => `\
'use strict';

// Add deps dll dirs
require('deps-${opts.lower}-${opts.gitid}');

module.exports = require('./binary/${opts.lower}');
`;
