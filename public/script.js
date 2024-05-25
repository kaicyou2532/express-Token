function searchUser() {
    const username = document.getElementById('username').value;
    fetch(`/api/users/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('user-data').textContent = `ユーザー名: ${data.player_name}`;
                document.getElementById('user-info').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
}

function addInfo() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const webUsername = document.getElementById('web-username').value;
    fetch(`/api/users/${username}/add-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, webUsername })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(`情報が追加されました。JWTトークン: ${data.token}`);
            document.getElementById('password').value = '';
            document.getElementById('web-username').value = '';
        }
    })
    .catch(error => console.error('Error:', error));
}

