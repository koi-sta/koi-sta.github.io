document.addEventListener('DOMContentLoaded', () => {
    // 全ての開閉用トグルボタンを取得
    const toggleButtons = document.querySelectorAll('.menu-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // クリックされたメニューの親要素（.menu-item）の active クラスを切り替える
            const menuItem = button.closest('.menu-item');
            menuItem.classList.toggle('active');
        });
    });
});

// 画面読み込み時にチェックボックスのイベントを設定
document.addEventListener('DOMContentLoaded', () => {
  setupFilterEvents();
});

function setupFilterEvents() {
  // side-bar等のメニュー内にあるすべてのチェックボックスを取得
  const checkboxes = document.querySelectorAll('.sub-menu input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    // 各チェックボックスの変更イベントを監視
    checkbox.addEventListener('change', (e) => {
      const targetKey = e.target.name; // 例: "follower_count"
      const targetCard = document.getElementById(`kpi-card-${targetKey}`);

      if (targetCard) {
        // checked（true）なら表示、未チェック（false）なら非表示
        targetCard.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  });
}