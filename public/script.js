function searchUser() {
    const username = document.getElementById('username').value;
    fetch(`/api/users/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('user-data').textContent = `ユーザー名: ${data.username}`;
                document.getElementById('user-info').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
}

function addInfo() {
    const username = document.getElementById('username').value;
    const additionalInfo = document.getElementById('additional-info').value;
    fetch(`/api/users/${username}/add-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ additionalInfo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('情報が追加されました');
            document.getElementById('additional-info').value = '';
        }
    })
    .catch(error => console.error('Error:', error));
}
