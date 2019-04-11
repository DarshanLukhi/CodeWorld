var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');
psTree = require('ps-tree');

exports.stats = false ;


exports.compileCPP = function ( envData ,  code , fn ) {
	
	var filename = cuid.slug();
	path = './Data/IDE/';
	var finished = false;
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){
		if(exports.stats)
		{
			if(err)
				console.log('ERROR: '.red + err);
			else
			{
				console.log('INFO: '.green + filename +'.cpp created');
				

				//compile c code
				commmand = 'g++ ' + path + filename +'.cpp -w -o '+path + filename +'.exe' ;
				exec(commmand , function ( error , stdout , stderr ) {
					
					if(error)
					{
						if(exports.stats)
						{
							console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
						}
						var x =  path + filename +'.cpp:';
						var regex = new RegExp(x, 'g');

						var out = { error : stderr.replace(regex,'') };
						if(!finished)
						{

							finished = true;
							fn(out);
						}
					}
					else if(stderr) {
						var x =  path + filename +'.cpp:';
						var regex = new RegExp(x, 'g');

						var out = { error : stderr.replace(regex,'') };
						if(!finished)
						{

							finished = true;
							fn(out);
						}
					}
					else
					{
						

						var command = "cd "+ path + " & "+ filename ;
						var a = exec( command ,envData.options, function ( error , stdout , stderr ){
							if(error)
							{
								if(a.signalCode == 'SIGINT')
								{
									var out = { error : 'ERROR CODE : TLE\nDetails : Time Limit Exceeded',output : stdout};
									/*
									exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr )
									{								
										if(!finished)
										{
											finished = true;
											fn(out);
										}						
									});	
									*/
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
								else if(error.toString().indexOf('stdout maxBuffer length exceeded') != -1)
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
									if(!finished)
									{

										finished = true;
										if(exports.stats)
										{
											console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										}
										var out = {output: stdout};
										if(!stdout)
										{
												var out = {output: 'No Output'};
										}
										fn(out);
									
									}
									
								}
								
							}
							else if(stderr) {
								var x =  path + filename +'.cpp:';
								var regex = new RegExp(x, 'g');

								var out = { error : stderr.replace(regex,'') };
								if(!finished)
								{

									finished = true;
									fn(out);
								}
							}
							else
							{
								if(!finished)
								{

									finished = true;
									if(exports.stats)
									{
										console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
									}
									var out = {output: stdout};
									if(!stdout)
									{
											var out = {output: 'No Output'};
									}
									fn(out);
								
								}
								
							}
						});
						
					}

				});
			}	//end of else part of err
		}	//end of expors.stats
	}); //end of write file


}
exports.compileCPPWithInput = function ( envData , code , input ,  fn ) 
{
	var filename = cuid.slug();
	path = './Data/IDE/';
	var finished = false;
	//create temp0 
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err )
	{
		if(exports.stats)
		{
			if(err)
				console.log('ERROR: '.red + err);
			else
			{
				console.log('INFO: '.green + filename +'.cpp created');


					//compile c code
					commmand = 'g++ ' + path + filename +'.cpp -w -o '+ path + filename+'.exe' ;
					exec(commmand , function ( error , stdout , stderr )
					{

						if(error)
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							}
							var x =  path + filename +'.cpp:';
						    var regex = new RegExp(x, 'g');

							var out = { error : stderr.replace(regex,'') };
							if(!finished)
							{

								finished = true;
								fn(out);
							}
						}
						else if(stderr) 
						{
							var x =  path + filename +'.cpp:';
							var regex = new RegExp(x, 'g');

							var out = { error : stderr.replace(regex,'') };
							if(!finished)
							{

								finished = true;
								fn(out);
							}
						}
						else
						{
							if(input)
							{
								var inputfile = filename + '.txt';

								fs.writeFile( path  +  inputfile , input  , function(err ){
									if(exports.stats)
									{
										if(err)
											console.log('ERROR: '.red + err);
										else
											console.log('INFO: '.green + inputfile +' (inputfile) created');
									}
								});
								var tempcommand = "cd "+ path + " & "+ filename ;

								var a = exec( tempcommand + '<' + inputfile , envData.options,function( error , stdout , stderr )
								{

									if(error)
									{
										if(a.signalCode == 'SIGINT')
										{
											var out = { error : 'ERROR CODE : TLE\nDetails : Time Limit Exceeded',output : stdout};
											/*
											exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr )
											{								
												if(!finished)
												{
													finished = true;
													fn(out);
												}						
											});	
											*/
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
										else if(error.toString().indexOf('stdout maxBuffer length exceeded') != -1)
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
											if(!finished)
											{

												finished = true;
												if(exports.stats)
												{
													console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
												}
												var out = {output: stdout};
												if(!stdout)
												{
														var out = {output: 'No Output'};
												}
												fn(out);
											
											}
											
										}
									}
									else if(stderr) 
									{
										var x =  path + filename +'.cpp:';
										var regex = new RegExp(x, 'g');

										var out = { error : stderr.replace(regex,'') };
										fn(out);
									}
									else
									{
										if(!finished)
										{

											finished = true;
											if(exports.stats)
											{
												console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
											}
											var out = {output: stdout};
											if(!stdout)
											{
													var out = {output: 'No Output'};
											}
											fn(out);										
										}
									}
								});

							}
						}
					});
				
			}
				
		}
	});	
}
