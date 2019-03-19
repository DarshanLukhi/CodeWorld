var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.stats = false ;

exports.compilePython = function (envData , code , fn){
	var filename = cuid.slug();
	path = './Data/IDE/';
	var finished = false;

	fs.writeFile( path  +  filename +'.py' , code  , function(err )
	{			
		if(exports.stats)
		{
			if(err)
			console.log('ERROR: in pyModule'.red + err);
		

		}
		if(!err)
		{
			console.log(3);
			var command = 'python ' + path + filename +'.py';
			exec( command , function ( error , stdout , stderr ){
				console.log("ERROR".yellow + error);
				console.log("STDERROR".yellow + stdout);
				console.log("SRDERR".yellow + stderr);
				if(error)
				{
					if(error.toString().indexOf('RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded') != -1)
					{
						var out = { error : 'SIGCONT' };
						if(!finished)
						{
							finished = true;
							fn(out);
						}
					}

					else {
						if(exports.stats)
						{
							console.log('INFO: '.green + filename + '.py contained an error while executing');
						}
						console.log("STDERROR".red + stderr);
						console.log("ERROR".red + error);
						
						if(stderr) 
						{
							var x = 'File \"'+ path + filename +'.py\",';

							var out = { error : stderr.replace(x,'') };
							if(!finished)
							{

								finished = true;
								fn(out);
							}
						}
					}													
				}
				else
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.py successfully executed !');
					}
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
		
	}});
}

exports.compilePythonWithInput = function( envData , code , input ,  fn){
	var finished = false;
	console.log('1');
	var filename = cuid.slug();
	path = './Data/IDE/';

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

			fs.writeFile(path + filename + 'input.txt' , input , function(err){
				if(exports.stats)
				{
					if(err)
					console.log('ERROR: '.red + err);
				    else
				    console.log('INFO: '.green + filename +'input.txt created');	
				}
				if(!err)
				{
					var command = 'python ' + path + filename +'.py < ' + path + filename +'input.txt ' ;
					exec( command , function ( error , stdout , stderr ){
						if(error)
						{
							/*if(error.toString().indexOf('RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: stdout maxBuffer length exceeded') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
								if(!finished)
								{
									finished = true;
									fn(out);
								}
							}*/
							if(error.toString().indexOf('Error: Command failed') != -1)
							{
								var out = { error : 'NZEC' };
								if(!finished)
								{
									finished = true;
									fn(out);
								}
							}
							
							else {
								if(exports.stats)
								{
									console.log('INFO: '.green + filename + '.py contained an error while executing');
								}
								console.log("STDERROR".red + stderr);
								console.log("ERROR".red + error);
								
								if(stderr) 
								{
									var x = 'File \"'+ path + filename +'.py\",';

									var out = { error : stderr.replace(x,'') };
									if(!finished)
									{

										finished = true;
										fn(out);
									}
								}
							}													
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.py successfully executed !');
							}
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
			if(envData.options.timeout && !finished)
			{
				console.log(123);
				// kill the programme after envData.options.timeout ms
				setTimeout(function (){
					exec("taskkill /im "+filename+".exe /f > nul",function( error , stdout , stderr )
					{
						if(!finished)
						{
						console.log("STDERROR".red + stderr);
						console.log("ERROR".red + error);
						console.log("STDOUT".red + stdout);						
						if(!finished)
						{
							// var out = { error : 'Time Limit exceed ' + (envData.options.timeout +1)/1000 };
							var out = { error : 'NZEC'};
							finished = true;
							fn(out);
						}
					}
				});
				},envData.options.timeout);
			}
		}
	});
}
