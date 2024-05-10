async function callApiWithGet(apiUrl) {
    const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });

    return await res.json();
}

async function callApiWithPost(apiUrl, param) {
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(param),
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });
    return await res.json();
}

async function callApiWithPostWithJsonBody(apiUrl, param) {
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: param,
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });
    return await res.json();
}

async function callApiWithUpdate(apiUrl, param) {
    const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(param),
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });

    return await res.json();
}

async function callApiWithDelete(apiUrl, param) {
    const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(param),
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });

    return await res.json();
}

async function callAuthenticatePost(param) {
    const res = await fetch("/authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: param,
    }).then(response => {
        if(response.status === 200 || response.status === 400) {
            return response;
        }

        if(response.status === 500) {
            location.href = "/error/500";
            return;
        }
    }).catch(error => {
        console.log(error);
    });
    return await res.json();
}