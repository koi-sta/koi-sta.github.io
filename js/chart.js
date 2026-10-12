// Chart.js のインスタンス保持用変数（例）
let trendChart = null;

// 初期化時にダミーデータなどでグラフを描画する関数
function initChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['10/6', '10/7', '10/8', '10/9', '10/10', '10/11', '10/12'], // 日付の例
      datasets: [
        {
          label: 'フォロワー数',
          data: [1200, 1205, 1210, 1220, 1235, 1250, 1260],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          hidden: false // 初期状態
        },
        // 他の指標のデータもここに追加していく
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// チェックボックスの変更イベントを拡張
function setupFilterEvents() {
  const checkboxes = document.querySelectorAll('.sub-menu input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const targetKey = e.target.id.replace('chk-', ''); // "follower_count" など
      const targetCard = document.getElementById(`kpi-card-${targetKey}`);

      // 1. KPIカードの表示切替
      if (targetCard) {
        targetCard.style.display = e.target.checked ? 'block' : 'none';
      }

      // 2. グラフ側のデータ系列（Dataset）の表示切替
      if (trendChart) {
        // グラフのデータセットから対応するものを探して visibility を切り替える
        const datasetIndex = trendChart.data.datasets.findIndex(ds => ds.label.includes(targetKey));
        if (datasetIndex !== -1) {
          trendChart.data.datasets[datasetIndex].hidden = !e.target.checked;
          trendChart.update();
        }
      }
    });
  });
}