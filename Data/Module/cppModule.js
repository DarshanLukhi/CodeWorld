var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');


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
				if(envData.cmd === 'g++')
				{

					//compile c code
					commmand = 'g++ ' + path + filename +'.cpp -w -o '+path + filename +'.exe' ;
					exec(commmand , function ( error , stdout , stderr ){
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

							var tempcommand = "cd "+ path + " & "+ filename ;
							exec( tempcommand , function ( error , stdout , stderr ){
								if(error)
								{

									if(error.toString().indexOf('stdout maxBuffer length exceeded') != -1)
									{
										var out = { error : 'Error: stdout maxBuffer exceeded.\nYou might have initialized an infinite loop.' };
										if(!finished)
										{

											finished = true;
											fn(out);
										}
									}
									/*
									else
									{
										if(exports.stats)
										{
											console.log('INFO: '.green + filename + '.cpp contained an error while executing');
										}
										
										var out = { error : stderr};
										console.log(error);
										if(out.error)
										{

											if(!finished)
											{

												finished = true;		
												fn(out);
											}
										}

									}*/
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
			}	//end of else part of err
		}	//end of expors.stats
	}); //end of write file


}
exports.compileCPPWithInput = function ( envData , code , input ,  fn ) {
	var filename = cuid.slug();
	path = './Data/IDE/';

	//create temp0 
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){
		if(exports.stats)
		{
			if(err)
				console.log('ERROR: '.red + err);
			else
			{
				console.log('INFO: '.green + filename +'.cpp created');
				if(envData.cmd ==='g++')
				{

					//compile c code
					commmand = 'g++ ' + path + filename +'.cpp -o '+ path + filename+'.exe' ;
					exec(commmand , function ( error , stdout , stderr ){
						console.log("STDERR ".red +stderr);
						console.log("STDOUT ".red + stdout);
						if(error)
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							}
							var out = { error : stderr };
							fn(out);
						}
						else if (stderr) {
							var x =  path + filename +'.cpp:';
						    var regex = new RegExp(x, 'g');

							var out = { error : stderr.replace(regex,'') };
							fn(out);
						}
						else
						{
							if(input){
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
								var progNotFinished=true;
								var tempcommand = "cd "+ path + " & "+ filename ;

								exec( tempcommand + '<' + inputfile , function( error , stdout , stderr ){
									if(error)
									{
										if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
										{
											var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
											fn(out);
										}
										else
										{
											if(exports.stats)
											{
												console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											}
											var out = { error : stderr};
											if(out.error)
											{
												progNotFinished=false;// programme finished
												fn(out);
											}
											
										}
									}
									else if(stderr) {
										var x =  path + filename +'.cpp:';
										var regex = new RegExp(x, 'g');

										var out = { error : stderr.replace(regex,'') };
										fn(out);
									}
									else
									{
										if(progNotFinished) {
											progNotFinished = false;
											if (exports.stats) {
												console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
											}
											var out = {output: stdout};
											if(!stdout)
											{
													var out = {output: ''};
											}
											fn(out);
										}
									}
								});
								/*if(envData.options.timeout && progNotFinished)
								{/*
									// kill the programme after envData.options.timeout ms
									setTimeout(function (){
										exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr ){
											if(progNotFinished)
											{
												progNotFinished=false;// programme finished
												if(exports.stats)
												{
													console.log('INFO: '.green + filename + '.exe was killed after '+envData.options.timeout+'ms');
												}
												var out = { error : 'Time Limit exceed ' + (envData.options.timeout +1)/1000 };
												fn(out);
											}
										});
									},envData.options.timeout);
								}*/

							}
							else //input not provided
							{
								if(exports.stats)
								{
									console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
								}
								var out = { error : 'Input Missing' };
								fn(out);
							}

						}


					});

				}
				else if ( envData.cmd == 'gcc')
				{
					//compile c code
					commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename+'.out' ;
					exec(commmand , function ( error , stdout , stderr ){
						if(error)
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							}
							var out = { error : stderr};
							fn(out);
						}
						else
						{
							if(input){
								var inputfile = filename + 'input.txt';

								fs.writeFile( path  +  inputfile , input  , function(err ){
									if(exports.stats)
									{
										if(err)
											console.log('ERROR: '.red + err);
										else
											console.log('INFO: '.green + inputfile +' (inputfile) created');
									}
								});

								exec( path + filename +'.out' + ' < ' + path + inputfile , function( error , stdout , stderr ){
									if(error)
									{

										if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
										{
											var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
											fn(out);
										}
										else
										{
											if(exports.stats)
											{
												console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											}
											var out =  { output : stderr};
											fn(out);
										}
									}
									else
									{
										if(exports.stats)
										{
											console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										}
										var out = { output : stdout};
										fn(out);
									}
								});

							}
							else //no input file
							{
								if(exports.stats)
								{
									console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
								}
								var out = { error : 'Input Missing' };
								fn(out);
							}
						}
					});
				}
				else
				{
					console.log('ERROR: '.red + 'choose either g++ or gcc ');
				}
			}	//end of else err
		}	//end of exports.stats
	});	//end of write file 							
} //end of compileCPPWithInput
