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
    const listName = req.query.list;
    const filterName = req.query.fName;
    const filterValue = req.query.fValue;

    if(accessToken){
        const client = graph.Client.init({
            authProvider: (done) => {
              done(null, accessToken);
            }
        });

        try{
            //Get root name
            const rootName = (await client
            .api(`/sites/root`)
            .get()).siteCollection.hostname;

            //Get the Site ID
            const siteID = (await client
            .api(`/sites/${rootName}:/sites/${process.env.SITE_NAME}`)
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
            if(filterName && filterValue){
                let listItems = (await client
                .api(`/sites/${siteID}/lists/${listID}/items`)
                .filter(`fields/${filterName} eq ${filterValue}`)
                .expand('fields')
                .get()).value
                res.send(JSON.stringify(listItems));
            }else{
                res.send(JSON.stringify(listItems));
            }
        }catch(err){
            res.status('404').send(err.message);
        };
    }else{
        res.status('401').send('Need Login');
    }
});

router.post('/items', async function(req, res, next) {
    let accessToken = req.get('Authorization');
    let accessTokenArray = accessToken.split(' ');
    if(accessTokenArray[0] == 'Bearer'){
        accessToken = accessTokenArray[1];
    }else{
        accessToken = accessTokenArray[0];
    }

});


module.exports = router;