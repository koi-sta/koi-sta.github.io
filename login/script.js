document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  // ここに認証処理を追加します
  if (username === "admin" && password === "password123") {
    messageDiv.style.color = "green";
    messageDiv.textContent = "ログインに成功しました！";
  } else {
    messageDiv.style.color = "red";
    messageDiv.textContent = "ユーザー名またはパスワードが違います。";
  }
});