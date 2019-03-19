var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');
exports.stats = false ;
exports.compileCPPWithInput = function ( envData , code  ,  fn ) 
{
	console.log("START");
	
	var filename = cuid.slug();
	path = './Data/Contests/' + envData.ccode + '/'+envData.pcode + '/';
	var finished = false;
	
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err )
	{
		console.log(path);

		if(err)
			console.log('ERROR: '.red + err);
		else
		{
			console.log('INFO: '.green + filename +'.cpp created');

			commmand = 'g++ ' + path + filename +'.cpp -w -o '+ path + filename+'.exe' ;
			exec(commmand , function ( error , stdout , stderr )
			{
				console.log("CALL");
				if(error || stderr)
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
					
					var tempcommand = "cd "+ path + " & "+ filename ;
					console.log(tempcommand + ' < ' + path +'Testcase1.txt');
					exec( tempcommand + ' < ' +'Testcase1.txt' , function( error , stdout , stderr ){
						if(error)
						{
							var out = { error : 'RTE' };
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
						setTimeout(function (){
							exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr )
							{

							
								if(!finished)
								{
									// var out = { error : 'Time Limit exceed ' + (envData.options.timeout +1)/1000 };
									var out = { error : 'NZEC'};
									finished = true;
									fn(out);
								}
							
							});
						},envData.options.timeout);
					}
				
				}
			});
		
		}
			
	});	
}
