var cppModule = require('./contestCPPModule.js');
var pyModule = require('./contestPyModule.js');


exports.compileCPPWithInput = function ( envData , code  ,  fn ) { 
	cppModule.compileCPPWithInput(envData , code  , fn );	
}


exports.compilePythonWithInput = function( envData , code  ,fn){
	pyModule.compilePythonWithInput(envData , code  , fn );
}