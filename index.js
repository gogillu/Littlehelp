
var express = require('express');
var app = express();
var fs = require('fs');
var environment = require('dotenv');
var APIS = require('./apis')(app)

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('keys/privatekey.pem', 'utf8');
var certificate = fs.readFileSync('keys/certificate.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.set('trust proxy', 1) // trust first proxy


environment.config();



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// // Allow only https connections
// // Comment this function if you are using on localhost

app.get('*', function(req, res, next) {  
  console.log(req.secure);
  if(!req.secure)
  {
    console.log(req.headers.host.slice(0, req.headers.host.length - 5));
    res.redirect('https://' + req.headers.host.slice(0, req.headers.host.length - 5) +":8443" + req.url);
  }else
    next();
})

// Configure Routes to all the components using their respective routers

app.use(require('./app/site/router'));

app.use(require('./app/study_material/router'));

app.use(require('./app/upload/router'));

app.use(require('./app/feedback/router'));

app.use(require('./app/admin/router'))


// For increasing time on the site, to be implemented in future releases

app.get('/driver', function(request, response) {
  response.render('pages/driver');
});


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


httpServer.listen(process.env.PORT || 5000);
httpsServer.listen(8443);

