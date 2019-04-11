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
			
			var command = 'python ' + path + filename +'.py';
			var a = exec( command ,envData.options, function ( error , stdout , stderr ){
				if(error)
				{
					console.log(a);
					if( a.signalCode == 'SIGINT' )
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
						if(exports.stats)
						{
							console.log('INFO: '.green + filename + '.py contained an error while executing');
						}
						
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
								});	*/
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
							
							else {
								if(exports.stats)
								{
									console.log('INFO: '.green + filename + '.py contained an error while executing');
								}
	
								
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
			
		}
	});
}
