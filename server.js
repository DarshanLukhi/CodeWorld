var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var fs=require("fs");	
var path = require("path");
var jwt = require('jsonwebtoken');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var compiler = require('./Data/Module/compilex');
var contestCompiler = require('./Data/Module/contestCompilex');

var option = {stats : true};  
compiler.init(option);
var app = express();

var User = require('./Data/Model/user');
var Problem = require('./Data/Model/problem');
var Question = require('./Data/Model/question');
var Contest = require('./Data/Model/contest');
var Answer = require('./Data/Model/answer');
var Solutions = require('./Data/Model/solution');
var Ranking = require('./Data/Model/ranking');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/codeworld',{useNewUrlParser:true}).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
mongoose.set('useCreateIndex',true);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());
app.use(passport.initialize());
const port = process.env.PORT || 3000;

const server = app.listen(port, function(){
 console.log('Listening on port ' + port);
});

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
  res.header('ACCESS_Control-Allow-Headers','*');

  if('OPTIONS' === req.method)
  {
    return res.sendStatus(200);
  }
  next();
});

app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

passport.use(new localStrategy({ usernameField: 'user_name' },
    (username, password, done) => {
        User.findOne({  user_name: username },
            (err, user) => {
                if (err)
                    return done(err);
                // Unknown user
                else if (!user)
                    return done(null, false, { message: 'username is not registered' });
                // Wrong password 
                else if (!user.verifyPassword(password))
                    return done(null, false, { message: 'Wrong password.' })        
                // Authentication succeeded
                else
                    return done(null, user);
            });
    })
);


verifyJwtToken = (req, res, next) => {
    var token;
    if('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if(!token){
        return res.status(403).send({ auth: false, message: 'No token provided' });
    }
    else{
        jwt.verify(token, "SECRET#123",
            (err, decoded) => {
                if(err){
                    return res.status(500).send({ auth: false, message:  'Token authentication failed' });
                }
                else{
                    req._id = decoded._id; 
                    next();
                }    
            }
            )
    }    
}

app.get('/userProfile', verifyJwtToken, function (req, res, next){ 
    // Find Id after verify token
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else{
                return res.status(200).json({ status: true, user : user });    
            } 
        }
     );
});

//show another user profile in new tab
app.get('/profileById',function (req, res) {
  User.findOne( {user_name : req.headers.userid} ,function(error, result) {
    if(!error){
      return res.status(200).json({ status: true, user : result });    
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});

// After verify code make user logged in by user_name
app.get('/makeLoggedIn',function (req, res) {
  User.findOne( {user_name : req.headers.userid} ,function(error, user) {
    if(!error){
      return res.status(200).json({ "token": user.generateJwt() }); 
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});

// Send email for forget password code.
app.post('/sendMail', function (req, res) {
  User.findOne({ user_name: req.body.user_name},
    (err, user) => {
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else{
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'codeworld.india@gmail.com',
              pass: 'CodeWorld@1234'
            }
          });

          var mailOptions = {
            from: 'codeworld.india@gmail.com',
            to: user.email_id,
            subject: 'Replacement login information at CodeWorld for ' + req.body.user_name ,
            html: '<p>Hello '+ req.body.user_name +',</p><br><p>A request to reset the password for your account has been made at CodeWorld.</p><br><h1 align="center" style="color:blue">' + req.body.code + '</h1><br><p>Enter this code at your forget password page. After logging in, you will be redirected to new password page so you can change your password.</p><br><p>-Admin</p><p>CodeWorld</p>'
          };
          
          transporter.sendMail(mailOptions, function(error, info){}); 
          return res.status(200).send({});
        } 
    }
 );

});

app.post('/authenticate',function (req, res) {
    var userdata = new User();
    var username1 = req.body.user_name;
    var password1 = req.body.password;
    // Check for user
    User.findOne({user_name: username1 }, function(err, user) {
        if(err) return res.send(err);
        if(!user) {
            return res.status(404).json({ status: false, message: 'User record not found.' });
        }
        // Check for password
        if (password1 == user.password){
            return res.status(200).json({ "token": user.generateJwt() });
        } else {
            return res.status(404).json({ status: false, message: 'Password not match.' });
        }   
    });
});

app.post('/registration',function (req, res) {
    // Find user
    User.findOne({user_name: req.body.user_name }, function(err, user) {
        if(err) return res.send(err);
        // User already found
        if(user) {
             return res.status(422).send(['*Username is already taken']);
         }else {
             User.findOne({email_id: req.body.email_id}, function(err, user) {
             if(err) return res.send(err);
             // Email ID already found
             if(user) {
                return res.status(422).send(['*Email address is already register.']);
             } else {
                 // Now we can save user
            var userdata =new User({ 'user_name':req.body.user_name,'first_name':req.body.first_name,'last_name':req.body.last_name,'email_id':req.body.email_id,'mobile_no':req.body.mobile_no,'gender':req.body.gender,'birth_date':null,'role':"user",'city':null,'state':null,'password': password = req.body.password});
            userdata.save((err,doc) => {
                if (!err)
                    return res.status(200).json({ "token": userdata.generateJwt() });
                else
                {
                    console.log('error');
                }        
            });
            }
         });
        }
    });  
  });

  app.post('/updatePersonalDetail',verifyJwtToken, function(req, res) {
    User.updateOne({ _id: req._id },{$set: { first_name: req.body.first_name , last_name: req.body.last_name, gender: req.body.gender, birth_date: req.body.birth_date} } ,function(err) {
        if(err) return res.send(err);
        else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
    });
  });

  app.post('/updateCommunicationDetail',verifyJwtToken, function(req, res) {
    User.updateOne({ _id: req._id },{$set: { email_id: req.body.email_id , city: req.body.city, state: req.body.state, mobile_no: req.body.mobile_no } } ,function(err) {
        if(err) return res.send(err);
        else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
    });
  });

  app.post('/updatePrivacyDetail',verifyJwtToken, function(req, res) {
    User.updateOne({ _id: req._id },{$set: { password: req.body.newpassword  } } ,function(err) {
        if(err) return res.send(err);
        else return res.status(200).json({ status: true, message: 'Profile updated successfully.' });
    });
  });



  // ##################################################################################
 
  
// show all question on discuss page
app.get('/questions',function (req, res) {
    Question.find( {} ,function(error, result) {
      if(!error){
        return res.send(result);
      }
      else{
        console.log("Error On Retriving...");
        return res.send(error);
      }
    });
});


//show all anser for one question
app.get('/answers',function (req, res) {
  //console.log(req.headers);
  Answer.find( { questionId : req.headers.questionid } ,function(error, result) {
    if(!error){
      Question.findOne({ _id : req.headers.questionid }, function(error, que) {
         Question.updateOne({ _id : req.headers.questionid }, {$set: { viewCount: ++que.viewCount }}, function(error, upque) {});
      });
      //console.log(result);
      return res.send(result);
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});


//show question in new tab
app.get('/questionbyid',function (req, res) {
  //console.log(req.headers);
  Question.find( {_id : req.headers.questionid} ,function(error, result) {
    if(!error){
      return res.send(result);
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});


//post new question
app.post('/question',function (req, res) {
  let data = new Question({
    userId : req.body.userId,
    question : req.body.question,
    timeStamp :  Date.now(),
    viewCount : 0,
    ansCount : 0
  });
  data.save(function(error,doc){
    if(!error)
      res.status(200).send({"message": "problem added successfully"});
    else{
      res.status(422).send(['Add Question Failed']);
    }
  });
});


//post answer for question
app.post('/answer',function (req, res) {
  let data = new Answer({
    userId : req.body.userId,
    questionId : req.body.questionId,
    answer : req.body.answer,
    timeStamp :  Date.now(),
    likeCount : 0,
    dislikeCount : 0
  });

  
  data.save(function(error,doc){
    if(!error){
      Question.findOne({ _id : req.body.questionId }, function(error, que) {
        Question.updateOne({ _id : req.body.questionId }, {$set: { ansCount: ++que.ansCount }}, function(error, upque) {});
      });
      res.status(200).send({"message": "answer added successfully"});
    }
    else{
      res.status(422).send(['Post Answer Failed']);
    }
  });
});


//give like
app.post('/like',function (req, res) {
  Answer.findOne({ _id : req.body.id }, function(error, ans) {
    if(!error){
      Answer.updateOne({ _id : req.body.id }, {$set: { likeCount: ++ans.likeCount }}, function(err, upque) {
        if(err){
          res.status(422).send(['Something went wrong.']);
        };
      });
    }
    else{
      res.status(422).send(['No Record Found.']);
    }
  });
});


//give dislike
app.post('/dislike',function (req, res) {
  Answer.findOne({ _id : req.body.id }, function(error, ans) {
    Answer.updateOne({ _id : req.body.id }, {$set: { dislikeCount: ++ans.dislikeCount }}, function(error, upque) {});
  });
});



// admin delete answer
app.delete('/deleteanswer', function (req, res) {
  try { 
    Answer.findOne({ _id : req.headers.answerid }, function(error1, ans) {
      if(error1) {
        res.status(422).send(['Record Not Found.']);
      } else {
        Answer.deleteOne({_id: req.headers.answerid } , function(error2, upque) {
          if(error2){
            res.status(422).send(['Something went wrong.']);
          } else {
            Question.findOne({ _id : req.headers.questionid }, function(error3, que) {
              if(error3){
                res.status(422).send(['Something went wrong.']);
              } else {
                Question.updateOne({ _id : req.headers.questionid }, {$set: { ansCount: --que.ansCount }}, function(error4, upque) {
                  if(error4){
                    res.status(422).send(['Something went wrong.']);
                  } else {
                    res.status(200).send({"message": "Deleted"});
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  catch(err) {
    res.status(422).send(['Something went wrong.']);
  }
});


// admin delete questio
app.delete('/deletequestion', function (req, res) {
  Answer.deleteMany({questionId: req.headers.questionid } , function(err, upque) {
    if(err){
      res.status(422).send(['Something went wrong.']);
    }
  });

  Question.deleteOne({_id: req.headers.questionid } , function(err, upque) {
    if(err){
      res.status(422).send(['Something went wrong.']);
    }
    res.status(200).send({"message": "Deleted"});
  });
});


// show question ask by particular user
app.post('/my-questions',function (req, res) {
  Question.find( {userId: req.body.user_name} ,function(error, result) {
    if(!error){
      return res.send(result);
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});



// show answer given by particular user
app.post('/my-answers',function (req, res) {
  var Finalresult = [];
  var temp = [];
  Answer.find( {userId: req.body.user_name} ,function(error, result) {
    if(!error){
      var ii=0;
      result.forEach(i => {
        Question.findOne({_id: i['questionId']} ,function(error,result1){
          if(!error) {
            Finalresult.push(result1);
            ii++;
            if(ii == result.length) {
              return res.send(Finalresult);
            }
          }
        });
      }); 
    }
    else{
      console.log("Error On Retriving...");
      return res.send(error);
    }
  });
});




// #################################################################################



app.post('/addproblem',function(req, res){

    let data = new Problem({
      problemCode:req.body.problemCode,
      problemName:req.body.problemName,
      problemType:req.body.problemType,
      problemStatus:req.body.problemStatus,
      No_of_testcase:req.body.No_of_testcase
    });
    console.log(data);
    Problem.findOne({'problemCode' : req.body.problemCode },function(error,status) {
      if(status) {
        res.status(422).send(['problem code is already taken']);
      }
      else {
        var dirpath = path.join(__dirname,'Data','Problems','/');
    
  
        fs.mkdir(dirpath+req.body.problemCode,function(err) {
          this.dirpath = path.join(dirpath , req.body.problemCode,'/');
          if (err) {
            // directory alredy exist;
          }
          fs.writeFile(this.dirpath+'Defination.txt',req.body.Defination,function(err){
            if (err) {
              // problem in file creations
            };
          });
      
          var x = req.body.Testcase.split('#############################################');
          var i,filename = [],output = [];
          for(i=1;i<x.length;i++){
            filename[i-1]="Testcase"+i+".txt";
            output[i-1]="Output"+i+".txt";
          }
          
          for(i=0;i<x.length-1;i++){
            var content = x[i].split("###############");
            fs.writeFile(this.dirpath+filename[i],content[0].trim(),function(err){
              if (err) {
                 console.log(i);
              };
            });
            fs.writeFile(this.dirpath+output[i],content[1].trim(),function(err){
              if (err) {
                 console.log(i);
              };
            });
          }
          
          data.save(function(error,doc){
            if(!error)
              res.status(200).send({"message": "problem added successfully"});
            else{
              console.log(error);
              res.status(422).send([error]);
            }
          });
      
          });
      }
      
    });
    
  });
  
  app.get('/problems',function (req, res) {
    Problem.find( {} ,function(error,data) {
      //console.log(contestData);
      if(!error) {
        return res.send(data);
      }
      else{
        console.log("oh my god");
        return res.send(error);
      }
        
    });
  });
  
  
  app.get('/problem',function (req, res) {
    testcase = '';
    defination = '';
    code=req.query.problemCode;
    Problem.findOne(req.query ,function(error,data) {
      if(!error){
        var dirpath = path.join(__dirname,'Data','Problems','/',code, '/');
        defination = fs.readFileSync(dirpath +'Defination.txt').toString();
        
        var i,filename = [];
        for(i=0;i<data.No_of_testcase;i++){
          filename[i]="Testcase"+(i+1)+".txt";
        }
        for(i=0;i<data.No_of_testcase;i++){
          testcase += fs.readFileSync(dirpath +filename[i]).toString().concat('#############################################');
        }
  
        var response = {
          problemCode:data.problemCode,
          problemName:data.problemName,
          problemType:data.problemType,
          Defination:this.defination,
          No_of_testcase:data.No_of_testcase,
          Testcase:this.testcase
        };
  
        return res.send(response);
      }
      else{
        console.log("oh my god");
        return res.send(error);
      }
    });
  });
  
  
  // methods of contests //
  
  app.post('/createContest', function(req,res) {
    let data = new Contest({
      contestCode:req.body.contestCode,
      contestName:req.body.contestName,
      contestStatus:req.body.contestStatus,
      problems:req.body.problems,
      startDateTime:req.body.startDateTime,
      endDateTime:req.body.endDateTime,
  
    });
    Contest.findOne({'contestCode' : req.body.contestCode },function(error,status) {
    if(status) {
      res.status(422).send(['problem code is already taken']);
    }
    else
    {
      data.save(function(error,doc){
        if(!error)
        {
            var dirpath = path.join(__dirname,'Data','/Contests/',data.contestCode);
            
            fs.mkdir(dirpath,function(err) {
              dirpath = path.join(__dirname,'Data','/Contests/',data.contestCode,'/');
              data.problems.forEach(pcode => {
                fs.mkdir(dirpath+pcode,function(err) {
                  contestDir = path.join(__dirname,'Data','/Contests/',data.contestCode,'/',pcode,'/Testcase1.txt');
                  problemDir = path.join(__dirname,'Data','/Problems/',pcode,'/Testcase1.txt');
                  fs.copyFile(problemDir, contestDir  , (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                });  
              });  
            });
            
            
            res.status(200).send({"message": "contest created successfully"});
        }
        else{
          console.log(error);
          res.status(422).send([error]);
        }
      });
    }});
  }); 
  
  app.get('/getContests',function(req,res){
    Contest.find({},function(error,status) {
      if(!error)
      {
        res.send(status);
      }
      else
      {
        res.send(error);
      }
    });
  });
  
app.get('/getContest',function(req,res){
    Contest.find(req.query,function(error,status) {
      if(status[0] === undefined || error)  
      {
        res.status(422).send(['Contest Not Found']);
      }
      else
      {
        res.send(status);
      }
    });
});
app.post('/findAllProblems',function(req,res) {

  Problem.find({ problemCode: { $in: req.body }}, function(error, status){
    if(status[0] === undefined || error)  
    {
      console.log('Problem Not Found');
      res.status(422).send(['Problem Not Found']);
    }
    else
    {
      res.send(status);
    }
  });
});


app.post('/updateContest',function(req,res) {
  var myquery = { contestCode: req.body.contestCode };
  var newvalues = { $set: {contestStatus: req.body.contestStatus } };
  Contest.updateOne( myquery, newvalues, function(err, ress) {
    if (err) 
      console.log(err);
    else{
      res.status(200).send({"message": "contest Update successfully"});
    }
  });
});

app.post('/compilecode' , function (req , res ) {
  var code = req.body.code;	
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if(req.body.input) {
    inputRadio = true;
  }
  else
  {
    inputRadio = false;
  }
  
  if((lang === "C") || (lang === "C++"))
  {        
      if(inputRadio)
      {    
        var envData = { OS : "windows" , cmd : "g++" , options:{timeout : 5000}};
        compiler.compileCPPWithInput(envData , code ,input , function (data) {
          if(data.error)
          {
            res.status(422).send([data.error]);   		
          }
          else
          {
            res.send(data);
          }
        });
   }
   else
   {
     var envData = { OS : "windows" , cmd : "g++", options:{timeout : 5000}};	   
        compiler.compileCPP(envData , code , function (data) {
        if(data.error)
        {
          res.status(422).send([data.error]);
        }    	
        else
        {
          res.status(200).send(data);
        }
  
      });
   }
  }
  if(lang === "Java")
  {
      if(inputRadio)
      {
          var envData = { OS : "windows" , options:{timeout : 5000}}; 
          compiler.compileJavaWithInput( envData , code , input ,  function(data){

            if(data)
            {
              res.status(200).send(data);
            }
          });
      }
      else
      {
          var envData = { OS : "windows" , options:{timeout : 1000}};
          compiler.compileJava( envData , code , function(data){
            if(data)
            {
              res.status(200).send(data);
            }
          });

      }   

  }
  if( lang === "Python")
  {
      if(inputRadio)
      {
          var envData = { OS : "windows" , options:{timeout : 5000}};
          compiler.compilePythonWithInput(envData , code , input , function(data){
            if(data.error)
            {
              res.status(422).send([data.error]);
            }    	
            else
            {
              
              res.status(200).send(data);
            }
          });            
      }
      else
      {
          var envData = { OS : "windows" , options:{timeout : 5000}};
          compiler.compilePython(envData , code , function(data){
            if(data.error)
            {
              res.status(422).send([data.error]);
            }    	
            else
            {
              
              res.status(200).send(data);
            }
          });
      }
  }
});


app.post('/submitsolution' , function (req , res ) {
  var code = req.body.code;	
  var input = req.body.input;
  var lang = req.body.lang;
  var pcode = req.body.pcode;
  var ccode = req.body.ccode;
  var username = req.body.username;
  var problems = [];
  var response;


  Ranking.findOne({contestCode: ccode,user_name:username},function(error,status){
    if(!error && status != null){
      problems = status.problems;
    }
    if(status == null){
      let newranking = new Ranking({
        user_name:username,
        contestCode:ccode,
        points: 0,
        problems: [],
        rank: 0,
        rating: 0,
      });
      newranking.save((err,data) => {
        if(err)
        console.log(err)});
    }
      
  });
  var dirpath = path.join(__dirname,'Data','Problems','/',pcode, '/');
  var output = fs.readFileSync(dirpath + 'Output1.txt').toString();
  if((lang === "C") || (lang === "C++"))
  {         
        var envData = { OS : "windows" , options:{timeout : 5000}, pcode:pcode, ccode:ccode};
        contestCompiler.compileCPPWithInput(envData , code , function(data){
  
          if(data.error)
          {
              response = { status : data.error};
              res.status(200).send(response);
          }    	
          else
          {
            
            if(data.output.trim() == output)
            {
              response = { status : 'AC'};
              res.status(200).send(response);
            }
            else
            {
              response = { status : 'WA'};
              res.status(200).send(response);
            }

          }
          let solution = new Solutions( {
            user_name: username,
            DateTime:new Date(),
            contestCode:ccode,
            problemCode:pcode,
            status: response.status,
            language:lang,
          });
          solution.save((error,doc) => {if(error)console.log(error)});
          if(response.status == 'AC' && !problems.includes(pcode)){
            problems.push(pcode);
            let ranking = {
              user_name:username,
              contestCode:ccode,
              points: problems.length*100,
              problems: problems,
              rank: 0,
              rating: 0,
            }
            Ranking.updateOne(({contestCode: ccode,user_name:username}),{$set : ranking },(err) =>{if(err)console.log(err)});
          }
          
        });            
  }
  if(lang === "Java")
  {
    var envData = { OS : "windows" , options:{timeout : 3000,killSignal: 'SIGINT'}, pcode:pcode, ccode:ccode};
    contestCompiler.compileJavaWithInput(envData , code , function(data){
      
          if(data.error)
          {
              response = { status : data.error};
              res.status(200).send(response);
          }    	
          else
          {
            
            if(data.output.trim() == output)
            {
              response = { status : 'AC'};
              res.status(200).send(response);
            }
            else
            {
              response = { status : 'WA'};
              res.status(200).send(response);
            }

          }
          let solution = new Solutions( {
            user_name: username,
            DateTime:new Date(),
            contestCode:ccode,
            problemCode:pcode,
            status: response.status,
            language:lang,
          });
          solution.save((error,doc) => {if(error)console.log(error)});
          if(response.status == 'AC' && !problems.includes(pcode)){
            problems.push(pcode);
            let ranking = {
              user_name:username,
              contestCode:ccode,
              points: problems.length*100,
              problems: problems,
              rank: 0,
              rating: 0,
            }
            Ranking.updateOne(({contestCode: ccode,user_name:username}),{$set : ranking },(err) =>{if(err)console.log(err)});
          }

    });            
  }
  if( lang === "Python")
  {
    var envData = { OS : "windows" , options:{timeout : 5000}, pcode:pcode, ccode:ccode};
    contestCompiler.compilePythonWithInput(envData , code , function(data){
      
      if(data.error)
      {
          response = { status : data.error};
          res.status(200).send(response);
      }    	
      else
      {
        
        if(data.output.trim() == output)
        {
          response = { status : 'AC'};
          res.status(200).send(response);
        }
        else
        {
          response = { status : 'WA'};
          res.status(200).send(response);
        }

      }
      let solution = new Solutions( {
        user_name: username,
        DateTime:new Date(),
        contestCode:ccode,
        problemCode:pcode,
        status: response.status,
        language:lang,
      });
      solution.save((error,doc) => {if(error)console.log(error)});
      if(response.status == 'AC' && !problems.includes(pcode)){
        problems.push(pcode);
        let ranking = {
          user_name:username,
          contestCode:ccode,
          points: problems.length*100,
          problems: problems,
          rank: 0,
          rating: 0,
        }
        Ranking.updateOne(({contestCode: ccode,user_name:username}),{$set : ranking },(err) =>{if(err)console.log(err)});
      }
      

    });            
  }
});

