if (typeof law === 'undefined') window.law = {};

window.law.getListItems = async function (element, elementNeedUpdate, recourseOption, callback) {
    waitingDialog.show();
    const SelectValue = $(element).val();
    const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)graph_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let config = { headers: { Authorization: accessToken, } }
    try {
        if( recourseOption === 1 ) {
            var response = await axios.get(`http://localhost:4000/api/v2/departments?branchid='${SelectValue}'`, config);
        }else if( recourseOption === 2 ){
            var response = await axios.get(`http://localhost:4000/api/v2/employees?departmentid='${SelectValue}'`, config);
        }else if( recourseOption === 3 ){
            var response = await axios.get(`http://localhost:4000/api/v2/clients`, config);
        }else{
            throw 'Option error';
        }

        let resultHtml = '';
        for (let a of response.data.value) {
            resultHtml += callback(a);
        };
        $(elementNeedUpdate).html(resultHtml);
        waitingDialog.hide();
    } catch (error) {
        console.log(error);
        waitingDialog.hide();
    }
};

window.law.postListItems = async function (data, APIOption) {

    const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)graph_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let config = { headers: { Authorization: accessToken, } }
    try {
        if(APIOption === 1){
            await axios.post(`http://localhost:4000/api/v2/clients`, data, config);
        }else if(APIOption === 2){
            await axios.post(`http://localhost:4000/api/v2/matters`, data, config);
        }else{
            throw 'Option error'
        }
    } catch ( error ) {
        console.log(error);
    }

};


window.law.addPeople = function (elementValue, elementName, displayName) {
    const SelValue = $(elementValue).val();
    let resultHtml = '';
    resultHtml = `<li class="list-group-item">${displayName}</li>
                  <li class="list-group-item">${SelValue}</li>
                  <input type='hidden' name='${elementName}' value=${SelValue}> `;
    $(`#${elementName}_list`).html(resultHtml);
    $(`#${elementName}-delete`).show();
    $(`#${elementName}-add`).hide();
}

window.law.delPeople = function(elementName, displayName) {
    let resultHtml = '';
    resultHtml = `<li class="list-group-item">${displayName}</li>
                  <li class="list-group-item">Empty</li>
                  <input type='hidden' name='${elementName}' value="">`;
    $(`#${elementName}_list`).html(resultHtml);
    $(`#${elementName}-add`).show();
    $(`#${elementName}-delete`).hide();
}

