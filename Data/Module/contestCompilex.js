var cppModule = require('./cppModule.js');
var javaModule = require('./javaModule.js');
var pyModule = require('./contestPyModule.js');


exports.compileCPPWithInput = function ( envData , code , input ,  fn ) { 
	cppModule.compileCPPWithInput(envData , code , input , fn );	
}


exports.compileJavaWithInput = function ( envData , code , input ,  fn ){
	javaModule.compileJavaWithInput( envData , code , input ,  fn );	
}

exports.compilePythonWithInput = function( envData , code , input ,fn){
	pyModule.compilePythonWithInput(envData , code , input , fn );
}