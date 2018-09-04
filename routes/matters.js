var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
const axios = require('axios');


router.get('/', async function (req, res, next) {
  let parms = { title: 'Matters', active: { matters: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
  } else {
    parms.signInUrl = authHelper.getAuthUrl();
  }

  res.render('matters', parms);
});

router.get('/createnew', async function (req, res, next) {
  let parms = { title: 'Fatto', active: { matters: true }, createFormView: '1' };
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
  } else {
    parms.signInUrl = authHelper.getAuthUrl();
    res.redirect('/');
  }

  // let matter = new Matters();
  // matter.new();


  let config = {headers: { Authorization: accessToken,}};

  try {
    let response = await axios.get(`${process.env.API_HOSTNAME}/api/v2/branches`, config);
    parms.caseBranchOption = response.data.value;
    response = await axios.get(`${process.env.API_HOSTNAME}/api/v2/casetype`, config);
    parms.caseCategoryOption = response.data.value;    
    response = await axios.get(`${process.env.API_HOSTNAME}/api/v2/departments`, config);
    parms.caseDepartmentOption = response.data.value;
    response = await axios.get(`${process.env.API_HOSTNAME}/api/v2/clients`, config);
    parms.clientList = response.data.value;    

  } catch (error) {
    console.error(error);
  }
  res.render('matters', parms);



});
module.exports = router;