var express = require('express');
var router = express.Router();
var graph = require('@microsoft/microsoft-graph-client');

router.get('/items', async function(req, res, next){
    let accessToken = req.get('Authorization');
    let accessTokenArray = accessToken.split(' ');
    if(accessTokenArray[0] == 'Bearer'){
        accessToken = accessTokenArray[1];
    }else{
        accessToken = accessTokenArray[0];
    }
    const tenantName = req.query.tenant;
    const siteName = req.query.site;
    const listName = req.query.list;

    if(accessToken){
        const client = graph.Client.init({
            authProvider: (done) => {
              done(null, accessToken);
            }
        });

        try{
            //Get the Site ID
            const siteID = (await client
            .api(`/sites/${tenantName}.sharepoint.com:/sites/${siteName}`)
            .select('id')
            .get()).id
            
            const listID = (await client
            .api(`/sites/${siteID}/lists`)
            .filter(`displayName eq '${listName}'`)
            .get()).value[0].id
                
            //Get the liste item in case category list
            let listItems = (await client
            .api(`/sites/${siteID}/lists/${listID}/items`)
            .expand('fields')
            .get()).value
            res.send(listItems);
        }catch(err){
            res.status('404').send(err.message);
        };
    }else{
        res.status('401').send('Need Login');
    }
});


module.exports = router;