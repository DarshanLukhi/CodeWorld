var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.compileJavaWithInput = function (envData , code  , fn ){
	
    var dirname = cuid.slug();
	//path = './Data/IDE/'+dirname;
	path = './Data/Contests/' + envData.ccode + '/'+envData.pcode + '/'+dirname;
	var finished = false;


	fs.mkdir(path , 0777 , function(err){	
		if(err)
			console.log(err.toString().red);
		else
		{
			fs.writeFile( path  + "/CodeWorld.java" , code  , function(err ){			
				if(err)
					console.log('ERROR: '.red + err);
			    else
			    {
			    						
					var command = "cd "+path+ " & " + " javac CodeWorld.java";
					exec(command , function( error , stdout , stderr ){	
				
						if(error || stderr)
						{
							var out = { error : 'CTE', location : path  +  '/CodeWorld.java' };
							if(!finished)
							{

								finished = true;
								fn(out);
							}													
						}
						else
						{

							var command = "cd "+path+" & java -cp . CodeWorld < ./../Testcase1.txt";
							var x = exec(command  ,envData.options, function( error , stdout , stderr ){
								
								if(error)
								{
									
									
									if(error.killed){
										var out = { error : 'TLE', location : path  +  '/CodeWorld.java'};
										if(!finished)
										{
											finished = true;
											fn(out);
										}
									}
									psTree(x.pid, function (err, children) {
										children.forEach(p => {
											exec('taskkill/pid '+p.PID+' /F',function( err , stdout , stderr ){
												if(err)
													console.log("kill Error".red+error);	
											});
										});
									});
									

									var out = { error : 'RTE', location : path  +  '/CodeWorld.java' };
									if(!finished)
									{

										finished = true;
										fn(out);
									}	
									
								}
								else
								{						
			
									var out = { output : stdout, location : path  +  '/CodeWorld.java'};
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
	});
}