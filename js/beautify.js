/**
 * 美化脚本：顶部阅读进度条
 * ---------------------------------------------------------------------------
 * 在页面顶部生成一条 2px 主色进度线，随滚动显示当前阅读位置。
 * 样式见 source/css/custom.css 的「11. 顶部阅读进度条」。
 *
 * 说明：
 *   - 本站未启用 PJAX（pjax.enable: false），脚本只需初始化一次
 *   - 用 requestAnimationFrame 节流，避免 scroll 事件高频触发重排
 *   - 用 scrollHeight - clientHeight 计算，短页面（无滚动）时进度为 0 不显示
 */
(function () {
  'use strict';

  function initProgress() {
    if (document.getElementById('mk-progress')) return;

    var bar = document.createElement('div');
    bar.id = 'mk-progress';
    document.body.appendChild(bar);

    var doc = document.documentElement;
    var ticking = false;

    function update() {
      ticking = false;
      var max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        bar.style.width = '0';
        return;
      }
      var top = window.pageYOffset || doc.scrollTop || 0;
      var percent = Math.min(1, Math.max(0, top / max));
      bar.style.width = (percent * 100).toFixed(2) + '%';
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', update, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgress, { once: true });
  } else {
    initProgress();
  }
})();

/**
 * 侧栏「本站」统计卡
 * ---------------------------------------------------------------------------
 * 数据由 scripts/site-stats.js 在构建时算好，注入到 window.MK_STATS。
 * 这里只负责渲染卡片，插在 .card-info 之后。
 * 参考 blog.zhheo.com 的统计卡，但只保留本地能算的项，不依赖第三方服务。
 */
(function () {
  'use strict';

  function fmt(n) {
    n = Number(n) || 0;
    if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  function build() {
    // 注意：window.MK_STATS 由 site-stats.js 注入在 body_end 更靠后的位置，
    // 本脚本执行时可能还没定义，所以必须在 DOMContentLoaded 之后才取值，
    // 不能放在 IIFE 顶部判断（那样会直接 return 掉）。
    var S = window.MK_STATS;
    if (!S || document.querySelector('.mk-stats')) return;
    var info = document.querySelector('.card-info');
    if (!info) return;

    var rows = [
      ['已运行', S.days + ' 天'],
      ['总字数', fmt(S.words)],
      ['篇均', fmt(S.avgWords) + ' 字'],
      ['最后更新', S.lastUpdate || '—']
    ];

    var html =
      '<div class="item-headline"><i class="fas fa-chart-line"></i><span>本站</span></div>' +
      '<div class="mk-stats-list">';
    rows.forEach(function (r) {
      html +=
        '<div class="mk-stats-row">' +
        '<span class="mk-stats-label">' + r[0] + '</span>' +
        '<span class="mk-stats-value">' + r[1] + '</span>' +
        '</div>';
    });
    html += '</div>';

    var card = document.createElement('div');
    card.className = 'card-widget mk-stats';
    card.innerHTML = html;
    info.insertAdjacentElement('afterend', card);
  }

  function boot() {
    build();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
