var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rentomojo'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/login.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/signup.html',function(request,response){
    response.sendFile(path.join(__dirname + '/signup.html'));
});
app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
   if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.post('/signup',function(request,response){
    var username = request.body.uname;
    var email = request.body.email;
    var password = request.body.pass;
    var confirmpassword = request.body.cpass;
    if(username && email && password && confirmpassword){
        connection.query('INSERT INTO users (USERNAME, EMAIL, PASSWORD, CONFIRMPASSWORD) VALUES ( ?, ?, ?, ?) ',[username, email, password, confirmpassword], function(error, results){
            if (results) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else{
                if(password != confirmpassword)
                response.send('Make Sure both the passwords are same');
                else
                response.send('UserName or Email is already in use');
           }
            response.end()
        });
    }else{
        response.send('Fill the Complete Form');
        response.end();
    }
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
app.listen(3000);