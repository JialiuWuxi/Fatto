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

  let config = {headers: { Authorization: accessToken,}};

  try {
    let response = await axios.get(`${process.env.API_HOSTNAME}/api/lists/items?list=${process.env.CASE_BRANCH_LIST_NAME}`, config);
    parms.caseBranchOption = response.data;
    response = await axios.get(`${process.env.API_HOSTNAME}/api/lists/items?list=${process.env.CASE_CATEGORY_LIST_NAME}`, config);
    parms.caseCategoryOption = response.data;    
    response = await axios.get(`${process.env.API_HOSTNAME}/api/lists/items?list=${process.env.CASE_DEPARTMENT_LIST_NAME}`, config);
    parms.caseDepartmentOption = response.data;
    parms.caseDepartmentListName = process.env.CASE_DEPARTMENT_LIST_NAME;
    parms.caseDepartmentListBranchidCoulunm = process.env.CASE_DEPARTMENT_LIST_BRANCHID_COULUMN;
    parms.caseEmployeeListName = process.env.CASE_EMPLOYEE_LIST_NAME;
    parms.caseEmployeeListBranchidCoulunm = process.env.CASE_EMPLOYEE_LIST_DEPARTMENTID_COULUMN;

  } catch (error) {
    console.error(error);
  }
  res.render('matters', parms);
});
module.exports = router;