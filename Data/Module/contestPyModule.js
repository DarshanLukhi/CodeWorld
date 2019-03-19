var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false ;
exports.compilePythonWithInput = function( envData , code ,  fn){
	var finished = false;
	var filename = cuid.slug();
	path = './Data/Contests/' + envData.ccode + '/'+envData.pcode + '/';

	fs.writeFile( path  +  filename +'.py' , code  , function(err ){			
		if(exports.stats)
		{
			if(err)
			console.log('ERROR: '.red + err);
		    else
		    console.log('INFO: '.green + filename +'.py createdddd');	
		}
		if(!err)
		{

			var command = 'python ' + path + filename +'.py < ' + path +'Testcase1.txt ' ;
			exec( command , function ( error , stdout , stderr ){
				if(error)
				{
					var out = { error : 'CTE' };
					if(!finished)
					{

						finished = true;
						fn(out);
					}													
				}
				else
				{
					var out = { output : stdout};
					if(!finished)
					{
						finished = true;
						fn(out);
					}
				}
			});
			if(envData.options.timeout && !finished)
			{
				// kill the programme after envData.options.timeout ms
				setTimeout(function (){
					exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr )
					{
									
						if(!finished)
						{
							
							var out = { error : 'TLE'};
							finished = true;
							fn(out);
						}
				});
				},envData.options.timeout);
			}
		}
	});
}
