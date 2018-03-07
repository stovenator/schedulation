const dynamodb  = require('../lib/dynamodb');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt    = require('bcrypt');
const saltRounds = 10;
const jwtsecret = '$ch3dul@t!0n';



let authenticate = (req, res) =>{
  let username = req.body.username;
  let password = req.body.password;
  let params = {
    TableName: "User",
    KeyConditionExpression: "#Email = :Email",
    IndexName: "UserEmailIndex",
    ExpressionAttributeNames:{ "#Email": "Email" },
    ExpressionAttributeValues: { ":Email": username }
  };

  myToken = dynamodb.query(params)
    .then( result => {
      let responseJson;
      if (result.Count !== 1 || !result.Items[0].hasOwnProperty('Password')){
        console.log("Not found");
        req.session.user="notfound"
        return res.status(403).end();
      }
      bcrypt.compare(password, result.Items[0].Password)
        .then( equal => {
          if (!equal){
          console.log("Bad pass");
          req.session.user="badpass"
            return res.status(403).end();
          }
          else {
            delete(result.Items[0].Password);
            console.log("We're setting the req.session.user here...", result.Items[0].ID)
            req.session.user = createToken(result.Items[0]);
            responseJson = {
                id: result.Items[0].ID,
                username: result.Items[0].email,
                firstName: "firstName",
                lastName: "lastName",
                token: 'fake-jwt-token'
            };
            return res.json(responseJson);
          }
        });
    })
    .catch( err =>{
      console.error("Caught Error: ", err);
      responseJson = {"user": "mstover"}
      return res.json(responseJson);
    });
}


let authorize = (role) =>{
    return (req, res, next) => {
      console.log("Authorize....")
      if (!req.session || !req.session.user) {
        return res.status(403).end();
      };
      verifyToken(req.session.user)
      .then( (token) => {
        console.log("Verified: ", token);
        if (_.isArray(role)) {
          let n = _.intersection(req.session.user.Role, role);
          if (n.length < 1) {
            return res.status(403).end();
          }
        } 
        else if (_.indexOf(req.session.user.roles, role) < 0) {
          return res.status(403).end();
        };

      })
      .catch( (err) =>{
        console.log("Error: ", err);
      })
      return next();
    };
};


let createToken = (user) =>{
  console.log("Creating token with data:", user);
  let token = jwt.sign(user, jwtsecret, { expiresIn: '24h' });
  return token; 
}

let verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtsecret, (err, decoded) => {
      if (err){
        reject(new Error('Invalid token:', err));
      }
      else
        resolve(decoded);
    });
  });
}

let logout = (req, res, next) =>{
    req.session.user = undefined;
    return next();
}

module.exports = {
    authenticate: authenticate,
    authorize: authorize,
    logout: logout
}