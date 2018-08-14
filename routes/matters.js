var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
const axios = require('axios');
 

router.get('/', async function(req, res, next) {
    let parms = { title: 'Matters', active: {matters: true }};

    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;
  
    if (accessToken && userName) {
      parms.user = userName;
    } else {
      parms.signInUrl = authHelper.getAuthUrl();
    }
    
    res.render('matters', parms);
});

router.get('/createnew', async function(req, res, next) {
    let parms = { title: 'Create new matter', active: {matters: true }};
    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;
  
    if (accessToken && userName) {
      parms.user = userName;
    } else {
      parms.signInUrl = authHelper.getAuthUrl();
    }

    let config = {
        headers: {
            Authorization: accessToken,
        }
    }
    axios.get('http://localhost:3000/api/lists/items?tenant=m365x937980&site=lt&list=Branch',config)
    .then(response => {
        parms.caseBranchOption = response.data;
    })
    .catch(error => {
      console.log(error);
    });

    
    res.render('matters', parms);
});



module.exports = router;