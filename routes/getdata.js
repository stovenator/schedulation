const _ = require('lodash');
const companylist = [{"name": "Mark Co.", "Industry": "engineering"}, {"name": "Nicole Stover, LCSW", "Industry": "therapy"}];


let company = (req, res) =>{
    console.log("Company called with args: ", req.params.companyName)
    return res.json(_.find(companylist, {"name": req.params.companyName}) || {})
}
let companies = (req,res) =>{
    console.log("Companylist...")
    return res.json(companylist);
}


module.exports = {
    company: company,
    companies: companies
}