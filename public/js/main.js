function deleteAccount(id, row) {
    fetch('/api/accounts/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then((response) => {
        switch(response["status"]) {
            case 302:
            case 401: {
                alert('unauthorized, redirect to login page...');
                setTimeout(() => window.location.href = "/admin/login", 1000);
                break;
            }
            case 404:
            case 200: {
                row.remove();
            }
            default: {
                alert(response["message"]);
            }
        }
    }).catch(error => {
        alert('could not delete account: ' + error);
    });
}

function updatePassword(id, row) {
    let password = prompt('please input a new password for this account:');
    
    while (password == null || password.trim() == "" || password.length < 8) {
        password = prompt('either no password was provided or it is too short (min 8 chars). please try again:');
    }

    const data = {
        'password': password
    };

    fetch('/api/accounts/' + id, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then((response) => {
        switch(response["status"]) {
            case 404: {
                alert('account not found!');
                row.remove();
                break;
            }
            case 302:
            case 401: {
                alert('unauthorized, redirect to login page...');
                window.location.href = "/admin/login";
                break;
            }
            default: {
                alert(response["message"]);
            }
        }
    }).catch(error => {
        alert('could not update account password: ' + error);
    });
}

function regenerateKey() {
    fetch('/api/regenerateKey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        if (data["status"] != 200) {
            alert('could not obtain new api key: ' + data["status"] + " " + data["message"]);
            return;
        }

        ["api-key", "create-api-key", "delete-api-key"].forEach((span) => {
            document.getElementById(span).innerText = data["data"]["key"];
        });
    }).catch(error => {
        alert('could not obtain new api key: ' + error);
    });
}

function createRedirect(key) {
    let name = prompt('what should we use as the name for this redirect');
    
    while (!name) {
        name = rompt('whoops, didn\'t quite catch that. what name should we use again?');
    }

    let url = prompt('alright. what url should we redirect to?');

    while (!url) {
        url = prompt('whoops, didn\'t quite catch that. what url should we redirect to again?');
    }

    const data = {
        name: name,
        url: url
    };

    fetch('/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': key
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
    .then(data => {
        if (data["status"] == 200) {
            let tbodyRef = document.getElementById('redirects').getElementsByTagName('tbody')[0];
            let newRow = tbodyRef.insertRow();
            
            let nameCell = newRow.insertCell();
            nameCell.appendChild(document.createTextNode(name));
    
            let urlCell = newRow.insertCell();
            urlCell.appendChild(document.createTextNode(url));

            let optionsCell = newRow.insertCell();
            let btn = document.createElement('input');
            btn.type = "button";
            btn.className = "btn";
            btn.value = "delete url";
            btn.onclick = (function(entry) { return deleteRedirect(name, newRow, key); });
            
            optionsCell.appendChild(btn);
        }

        alert(data["message"]);
    }).catch(error => {
        alert('could not create redirect: ' + error);
    });
}

function deleteRedirect(name, row, key) {
    const data = {
        name: name,
    };

    fetch('/api/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': key
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
    .then(data => {
        alert(data["message"]);
        if (data["status"] == 200) {
            row.remove();
        }
    }).catch(error => {
        alert('could not delete redirect: ' + error);
    });
}