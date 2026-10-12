// ==========================================
// 1. メニューの開閉処理（アコーディオン）
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.menu-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const menuItem = button.closest('.menu-item');
            menuItem.classList.toggle('active');
        });
    });
});

// ==========================================
// 2. グラフ関連の変数と初期化
// ==========================================
let trendChart = null;

function initChart() {
  const canvasElement = document.getElementById('trendChart');
  if (!canvasElement) return;

  const ctx = canvasElement.getContext('2d');
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['10/6', '10/7', '10/8', '10/9', '10/10', '10/11', '10/12'],
      datasets: [
        {
          label: 'フォロワー数',
          data: [1200, 1205, 1210, 1220, 1235, 1250, 1260],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          hidden: false
        }
        // 必要に応じて他のデータセットをここに追加
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// ==========================================
// 3. チェックボックスの連動処理（KPIカード ＆ グラフ）
// ==========================================
function setupFilterEvents() {
  const checkboxes = document.querySelectorAll('.sub-menu input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      // id (例: "chk-follower_count") から "chk-" を外してキーを取得。idがない場合は name をフォールバックにする
      let targetKey = '';
      if (e.target.id) {
        targetKey = e.target.id.replace('chk-', '');
      } else if (e.target.name) {
        targetKey = e.target.name;
      }

      if (!targetKey) return;

      const targetCard = document.getElementById(`kpi-card-${targetKey}`);

      // 1. KPIカードの表示切替
      if (targetCard) {
        targetCard.style.display = e.target.checked ? 'block' : 'none';
      }

      // 2. グラフ側のデータ系列の表示切替
      if (trendChart) {
        const datasetIndex = trendChart.data.datasets.findIndex(ds => ds.label.includes(targetKey));
        if (datasetIndex !== -1) {
          trendChart.data.datasets[datasetIndex].hidden = !e.target.checked;
          trendChart.update();
        }
      }
    });
  });
}

// ==========================================
// 4. ページ読み込み時の自動実行（競合を防ぐため1つに統合）
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initChart();          // グラフを描画
  setupFilterEvents();  // チェックボックスの連動を有効化
});
