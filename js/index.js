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

// 全項目のマスターデータ（ダミー例。実際にはAPIや別データから取得）
const allMetricsData = {
  follower_count: { label: 'フォロワー数', data: [1200, 1205, 1210, 1220, 1235, 1250, 1260], color: 'rgb(75, 192, 192)' },
  follows_count: { label: 'フォロー数', data: [300, 300, 301, 301, 302, 302, 303], color: 'rgb(54, 162, 235)' },
  media_count: { label: '投稿数', data: [45, 45, 46, 46, 46, 47, 47], color: 'rgb(255, 159, 64)' },
  impressions: { label: 'インプレッション', data: [5000, 5200, 4800, 6100, 5900, 6300, 7000], color: 'rgb(153, 102, 255)' },
  reach: { label: 'リーチ', data: [4000, 4100, 3900, 4800, 4600, 5000, 5500], color: 'rgb(255, 99, 132)' },
  profile_views: { label: 'プロフィール閲覧数', data: [150, 160, 140, 180, 170, 190, 210], color: 'rgb(255, 205, 86)' },
  website_clicks: { label: 'サイトクリック数', data: [10, 12, 8, 15, 14, 20, 18], color: 'rgb(201, 203, 207)' },
  email_contacts: { label: 'リンクタップ数', data: [5, 6, 4, 7, 6, 9, 8], color: 'rgb(75, 192, 192)' }
};

// グラフを描画・更新する関数
function updateChart(selectedKey = 'follower_count', startDate = null, endDate = null) {
  const canvasElement = document.getElementById('trendChart');
  if (!canvasElement) return;

  const ctx = canvasElement.getContext('2d');
  const metric = allMetricsData[selectedKey];

  // 3. 値が入っていない（データがない）場合はグラフに表示しない
  const hasData = metric && metric.data && metric.data.length > 0 && metric.data.some(val => val !== null && val !== undefined);

  const chartData = hasData ? metric.data : [];
  const chartLabel = metric ? metric.label : '';
  const chartColor = metric ? metric.color : 'rgb(0,0,0)';

  // 期間フィルターの処理（簡易的に日付ラベルをフィルタリングする例）
  let labels = ['10/6', '10/7', '10/8', '10/9', '10/10', '10/11', '10/12'];
  
  if (trendChart) {
    trendChart.data.labels = labels;
    trendChart.data.datasets = hasData ? [{
      label: chartLabel,
      data: chartData,
      borderColor: chartColor,
      tension: 0.1,
      hidden: false
    }] : [];
    trendChart.update();
  } else {
    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: hasData ? [{
          label: chartLabel,
          data: chartData,
          borderColor: chartColor,
          tension: 0.1,
          hidden: false
        }] : []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// ==========================================
// 3. コントロール（切り替えボタン・期間・チェックボックス）の設定
// ==========================================
function setupControls() {
  // ① HTML側に「指標切り替え用セレクター」や「日付ピッカー」を配置するためのセットアップ
  const chartSection = document.getElementById('chart-section');
  if (chartSection && !document.getElementById('chart-controls')) {
    const controlsHtml = `
      <div id="chart-controls" style="margin-bottom: 15px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
        <label>表示指標: 
          <select id="metric-selector" style="padding: 5px;">
            <option value="follower_count">フォロワー数</option>
            <option value="follows_count">フォロー数</option>
            <option value="media_count">投稿数</option>
            <option value="impressions">インプレッション</option>
            <option value="reach">リーチ</option>
            <option value="profile_views">プロフィール閲覧数</option>
            <option value="website_clicks">サイトクリック数</option>
            <option value="email_contacts">リンクタップ数</option>
          </select>
        </label>
        <label>期間: 
          <input type="date" id="start-date" style="padding: 4px;"> から 
          <input type="date" id="end-date" style="padding: 4px;">
        </label>
      </div>
    `;
    chartSection.insertAdjacentHTML('afterbegin', controlsHtml);

    // デフォルトで最長1年前〜今日の初期値を設定
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    if (startDateInput && endDateInput) {
      endDateInput.value = today.toISOString().split('T')[0];
      startDateInput.value = oneYearAgo.toISOString().split('T')[0];
      startDateInput.max = endDateInput.value;
      endDateInput.max = endDateInput.value;
      startDateInput.min = oneYearAgo.toISOString().split('T')[0];
    }

    // セレクター変更時のイベント
    document.getElementById('metric-selector').addEventListener('change', (e) => {
      updateChart(e.target.value);
    });
  }

  // ② チェックボックスとKPIカードの連動
  const checkboxes = document.querySelectorAll('.sub-menu input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      let targetKey = e.target.id ? e.target.id.replace('chk-', '') : e.target.name;
      if (!targetKey) return;

      const targetCard = document.getElementById(`kpi-card-${targetKey}`);
      if (targetCard) {
        targetCard.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  });
}

// ==========================================
// 4. ページ読み込み時の自動実行
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateChart('follower_count'); // 初期表示
  setupControls();
});
