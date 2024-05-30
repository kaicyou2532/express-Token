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
            document.getElementById('token-data').textContent = `JWTトークン: ${data.token}`;
            document.getElementById('recovered-token').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
}

function recoverToken() {
    const username = document.getElementById('recovery-username').value;
    fetch(`/api/users/${username}/recover-token`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('token-data').textContent = `JWTトークン: ${data.token}`;
                document.getElementById('recovered-token').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
}

function copyToken() {
    const tokenText = document.getElementById('token-data').textContent.replace('JWTトークン: ', '');
    navigator.clipboard.writeText(tokenText).then(() => {
        alert('トークンがクリップボードにコピーされました');
    }, () => {
        alert('トークンのコピーに失敗しました');
    });
}

function minecraftAuth() {
    alert('マインクラフト内でトークンの認証が完了しました！');
    // ここに追加の認証処理を実装します
}
