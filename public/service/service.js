if (typeof law === 'undefined') window.law = {};

window.law.getListItems = async function (element, elementNeedUpdate, callback) {
    waitingDialog.show();
    const SelectValue = $(element).val();
    const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)graph_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let config = { headers: { Authorization: accessToken, } }
    try {
        const response = await axios.get(`http://localhost:4000/api/v2/departments?branchid='${SelectValue}'`, config);

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

window.law.addPeople = function (elementValue, elementName, displayName) {
    const SelValue = $(elementValue).val();
    let resultHtml = '';
    resultHtml = `<li class="list-group-item">${displayName}</li>
                  <li class="list-group-item">${SelValue}</li>`;
    $(`#${elementName}_list`).html(resultHtml);
    $(`#${elementName}-delete`).show();
    $(`#${elementName}-add`).hide();
}

window.law.delPeople = function(elementName, displayName) {
    let resultHtml = '';
    resultHtml = `<li class="list-group-item">${displayName}</li>
                  <li class="list-group-item">Empty</li>`;
    $(`#${elementName}_list`).html(resultHtml);
    $(`#${elementName}-add`).show();
    $(`#${elementName}-delete`).hide();
}
