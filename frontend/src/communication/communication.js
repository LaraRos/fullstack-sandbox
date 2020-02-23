function handleHTTPError(response) {
    if (response.ok) {
        return response;
    } else {
        throw Error(response.statusText);
    }
}

function updateData(data) {
    return fetch("http://localhost:3001/todos/" + data.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        params: {"id": parseInt(data.id)}
    })
}

function getData() {
    return fetch('http://localhost:3001/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
          }
    })
        .then(handleHTTPError)
        .then(response => response.json())
        .catch(console.error)

}


export default {updateData, getData};