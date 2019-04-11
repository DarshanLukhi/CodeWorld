var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false ;
exports.compileCPPWithInput = function ( envData , code  ,  fn ) 
{
	
	var filename = cuid.slug();
	path = './Data/Contests/' + envData.ccode + '/'+envData.pcode + '/';
	var finished = false;
	
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err )
	{
		if(err)
			console.log('ERROR: '.red + err);
		else
		{
			console.log('INFO: '.green + filename +'.cpp created');

			commmand = 'g++ ' + path + filename +'.cpp  -w -o '+ path + filename+'.exe' ;
			exec(commmand , function ( error , stdout , stderr )
			{
				if(error || stderr)
				{
					var out = { error : 'CTE', location : path  +  filename +'.cpp' };
					if(!finished)
					{

						finished = true;
						fn(out);
					}													
				}
				else
				{
					
					var tempcommand = "cd "+ path + " & "+ filename ;
					console.log(tempcommand + ' < ' + path +'Testcase1.txt');
					var a = exec( tempcommand + ' < ' +'Testcase1.txt' ,envData.options, function( error , stdout , stderr ){
						if(error)
						{

							if(a.signalCode == 'SIGINT')
							{
								var out = { error : 'TLE', location : path  +  filename +'.cpp'};
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
								var out = { error : 'RTE', location : path  +  filename +'.cpp' };
								if(!finished)
								{

									finished = true;
									fn(out);
								}													
							}
						}
						else
						{
							var out = { output : stdout,  location : path  +  filename +'.cpp'};
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
			
	});	
}
