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

// 全項目のマスターデータ（例：日付と値のペアを持つ形式）
const allMetricsData = {
  follower_count: { 
    label: 'フォロワー数', 
    color: 'rgb(75, 192, 192)',
    history: {
      '2026-10-06': 1200, '2026-10-07': 1205, '2026-10-08': 1210, 
      '2026-10-09': 1220, '2026-10-10': 1235, '2026-10-11': 1250, '2026-10-12': 1260
    }
  },
  follows_count: { 
    label: 'フォロー数', 
    color: 'rgb(54, 162, 235)',
    history: {
      '2026-10-06': 300, '2026-10-07': 300, '2026-10-08': 301, 
      '2026-10-09': 301, '2026-10-10': 302, '2026-10-11': 302, '2026-10-12': 303
    }
  },
  media_count: { label: '投稿数', color: 'rgb(255, 159, 64)', history: {} },
  impressions: { label: 'インプレッション', color: 'rgb(153, 102, 255)', history: {} },
  reach: { label: 'リーチ', color: 'rgb(255, 99, 132)', history: {} },
  profile_views: { label: 'プロフィール閲覧数', color: 'rgb(255, 205, 86)', history: {} },
  website_clicks: { label: 'サイトクリック数', color: 'rgb(201, 203, 207)', history: {} },
  email_contacts: { label: 'リンクタップ数', color: 'rgb(75, 192, 192)', history: {} }
};

// グラフを描画・更新する関数（期間と指標を反映）
function updateChart() {
  const canvasElement = document.getElementById('trendChart');
  if (!canvasElement) return;

  const selector = document.getElementById('metric-selector');
  const selectedKey = selector ? selector.value : 'follower_count';
  const metric = allMetricsData[selectedKey];

  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  
  const startDate = startDateInput && startDateInput.value ? new Date(startDateInput.value) : null;
  const endDate = endDateInput && endDateInput.value ? new Date(endDateInput.value) : null;

  let labels = [];
  let dataValues = [];

  // ★ 選択された期間の全日付を生成し、記録がない日は「0」で埋める
  if (startDate && endDate) {
    let curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = curr.toISOString().split('T')[0];
      labels.push(dateStr);

      if (metric && metric.history && metric.history[dateStr] !== undefined) {
        dataValues.push(metric.history[dateStr]);
      } else {
        dataValues.push(0); // 記録がない日は0にする
      }

      curr.setDate(curr.getDate() + 1);
    }
  }

  const chartLabel = metric ? metric.label : '';
  const chartColor = metric ? metric.color : 'rgb(0,0,0)';

  const ctx = canvasElement.getContext('2d');

  if (trendChart) {
    trendChart.data.labels = labels;
    trendChart.data.datasets = [{
      label: chartLabel,
      data: dataValues,
      borderColor: chartColor,
      tension: 0.1,
      hidden: false
    }];
    trendChart.update();
  } else {
    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: dataValues,
          borderColor: chartColor,
          tension: 0.1,
          hidden: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// ==========================================
// 3. コントロール（セレクトボックス・日付）のセットアップ
// ==========================================
function setupControls() {
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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    if (startDateInput && endDateInput) {
      endDateInput.value = today.toISOString().split('T')[0];
      startDateInput.value = oneWeekAgo.toISOString().split('T')[0];
      startDateInput.max = endDateInput.value;
      endDateInput.max = endDateInput.value;
      startDateInput.max = endDateInput.value;

      // 日付が変更されたときのイベント
      startDateInput.addEventListener('change', updateChart);
      endDateInput.addEventListener('change', updateChart);
    }

    // セレクター（指標）が変更されたときのイベント
    document.getElementById('metric-selector').addEventListener('change', updateChart);
  }

  // チェックボックスとKPIカードの連動
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
  setupControls();
  updateChart(); // 初期表示
});
