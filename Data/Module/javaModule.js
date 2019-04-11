var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');
psTree = require('ps-tree');

exports.compileJava = function (envData , code , fn ){
	//creating source file
    var dirname = cuid.slug();
	path = './Data/IDE/'+dirname;
	var finished = false;
	var options = {
	  timeout: 3000,
	  killSignal: 'SIGINT'
	}
	fs.mkdir(path , 0777 , function(err){	
		if(err)
			console.log(err.toString().red);
		else
		{
			fs.writeFile( path  + "/CodeWorld.java" , code  , function(err ){			
				if(err && exports.stats)
					console.log('ERROR: '.red + err);
			    else
			    {
			    	if(exports.stats)
			    		console.log('INFO: '.green + path + "/CodeWorld.java created");	
						        
			    	
						var command = "cd "+path+ " & " + " javac CodeWorld.java";
						exec(command , function( error , stdout , stderr ){
						if(error)
						{
							
							if(exports.stats)							
								console.log("INFO: ".green + path + "/CodeWorld.java contained an error while compiling");
							var out = {error : stderr };
							if(!finished)
							{

								finished = true;
								fn(out);
							}
						}
						else
						{
							console.log("INFO: ".green + "compiled a java file");
							var command = "cd "+path+" & java -cp . CodeWorld";
							var x = exec(command  ,options, function( error , stdout , stderr ){
								if(error)
								{
									
									if(x.signalCode == 'SIGINT'){
										var out = { error : 'ERROR CODE : TLE\nDetails : Time Limit Exceeded',output : stdout};
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
										
									
										
									if(error.toString().indexOf('stdout maxBuffer length exceeded') != -1)
									{
										var out = { error : 'ERROR CODE : SIGTSTP\nMaximum Buffer Size Exceeded' };
										if(!finished)
										{

											finished = true;
											fn(out);
										}
									}
									else
									{
										if(exports.stats)
										{
											console.log('INFO: '.green + path  + '/CodeWorld.java contained an error while executing');
										}										
										var out = { error : stderr};
										if(!finished)
										{

											finished = true;
											fn(out);
										}
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
						}
					});
					
			    }		   
			});					
		}
	});
}



exports.compileJavaWithInput = function (envData , code , input , fn ){
	//creating source file
    var dirname = cuid.slug();
	path = './Data/IDE/'+dirname;
	var finished = false;
	var options = {
	  timeout: 3000,
	  killSignal: 'SIGINT'
	}

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
			    	console.log('INFO: '.green + path + "/CodeWorld.java created");				    	
			    	fs.writeFile( path + "/input.txt" , input , function (err){
			    		if(err)
							console.log('ERROR: '.red + err);
						else
						{
							
							var command = "cd "+path+ " & " + " javac CodeWorld.java";
							exec(command , function( error , stdout , stderr ){						
								if(error)
								{
									if(exports.stats)							
										console.log("INFO: ".green + path + "/CodeWorld.java contained an error while compiling");
									var out = {error :  stderr };
									if(!finished)
									{

										finished = true;
										fn(out);
									}
								}
								else
								{
									console.log("INFO: ".green + "compiled a java file");
									var command = "cd "+path+" & java -cp . CodeWorld < input.txt";
									var x = exec(command  ,options, function( error , stdout , stderr ){
										if(error)
										{
											if(x.signalCode == 'SIGINT'){
												var out = { error : 'ERROR CODE : TLE\nDetails : Time Limit Exceeded',output : stdout};
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

												});})
												});
												
											
												
											if(error.toString().indexOf('stdout maxBuffer length exceeded') != -1)
											{
												var out = { error : 'ERROR CODE : SIGTSTP\nMaximum Buffer Size Exceeded' };
												if(!finished)
												{

													finished = true;
													fn(out);
												}
											}
											else
											{
												if(exports.stats)
												{
													console.log('INFO: '.green + path  + '/CodeWorld.java contained an error while executing');
												}										
												var out = { error : stderr};
												if(!finished)
												{

													finished = true;
													fn(out);
												}
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
								}
			    			});
			    		}
					});
			    }		   
			});					
		}
	});
}
