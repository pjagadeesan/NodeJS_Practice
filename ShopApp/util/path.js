const path = require('path');

//require.main gives the root module from where the app started
module.exports = path.dirname(require.main.filename);
