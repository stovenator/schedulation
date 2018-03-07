const express = require('express');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const _ = require('lodash');

const auth = require('./routes/auth');
const getdata = require('./routes/getdata');
const authorize = auth.authorize;
const PORT = process.env.PORT || 8080;

app.set('trust proxy', 1) 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser())
app.use(cookieSession({
    secret: '$ch3dul@t!0n',
    cookie: { path: '/', httpOnly: true, maxAge: 24*60*60*1000}
}));

app.use( (req, res, next)=>{
    console.log("Session data: ", req.session);
    next();
})


let router = express.Router();


router.get('/user', function(req, res) {
    res.json({message: "API Call"});
});

router.post('/authenticate', auth.authenticate);
router.get('/logout', auth.logout);
router.get('/companies', authorize(['admin']), getdata.companies );
router.get('/company/:companyName', authorize(['admin']), getdata.company);

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
 console.log("/ requested");
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



app.listen(PORT);
console.log("Express server listening on port", PORT);


