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
			var a = exec( command ,envData.options,function ( error , stdout , stderr ){
				
				if(error)
				{
				
					if(a.signalCode == 'SIGINT')
					{
						var out = { error : 'TLE', location : path  +  filename +'.py' };
						psTree(a.pid, function (err, children) {
							children.forEach(p => {
								exec('taskkill/pid '+p.PID+' /F',function( err , stdout , stderr ){
									if(err)
										console.log("kill Error".red+error);	
								});
							});
						});
						if(!finished)
						{

							finished = true;
							fn(out);
						}	
					}
					else
					{
						var out = { error : 'CTE', location : path  +  filename +'.py' };
						if(!finished)
						{

							finished = true;
							fn(out);
						}													
					}
				}
				else
				{
					var out = { output : stdout, location : path  +  filename +'.py'};
					if(!finished)
					{
						finished = true;
						fn(out);
					}
				}
			});

		}
	});
}
