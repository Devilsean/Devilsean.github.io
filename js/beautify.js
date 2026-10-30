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
