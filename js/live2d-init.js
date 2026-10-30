/**
 * 看板娘初始化（oh-my-live2d）
 * ---------------------------------------------------------------------------
 * 替换了旧的 hexo-helper-live2d（L2Dwidget / Cubism 2 时代），原因：
 *   旧方案只认 Cubism 2 的 .moc 模型，画质停在十年前，贴图还是 256 色调色板，
 *   边缘锯齿和色阶断层明显，缩放后很容易糊。
 *   oh-my-live2d 内置 Cubism 2 + Cubism 5 两套 SDK，可用 Cubism 3/4/5 的 .moc3
 *   模型，画质和动作自然度都不是一个档次。
 *
 * 资源自托管（不依赖 unpkg / model.oml2d.com）：
 *   - 组件本体：/js/third-party/oh-my-live2d.min.js   (980K，含两套 SDK)
 *   - 模型文件：/live2d/Hiyori/                       (4.5M)
 *
 * 加载策略：
 *   组件本体和模型都不走首屏 —— 等 window.load 之后再动态插入 script，
 *   避免 980K 的 SDK 拖慢首屏。移动端直接跳过（省流量也省电）。
 *
 * 换模型：
 *   把新模型目录放进 source/live2d/<名字>/，改下面的 MODELS 即可。
 *   官方模型库：https://github.com/hacxy/l2d-models/tree/main/models
 */
(function () {
  'use strict';

  var LIB = '/js/third-party/oh-my-live2d.min.js';

  // 舞台与模型位置：贴左下角，尺寸压低，避免遮挡正文
  var MODELS = [
    {
      // 小埋（Cubism 2，入口是 model.json 而不是 .model3.json）
      // 28 个动作 + 35 段语音，Q 版身材，缩放比 Hiyori 稍大一些才合适
      path: '/live2d/umaru/model.json',
      position: [0, 20],
      scale: 0.15,
      stageStyle: {
        width: 250,
        height: 400
      }
    }
  ];

  function isMobile() {
    return (
      /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches
    );
  }

  function start() {
    if (typeof OML2D === 'undefined') return;
    try {
      OML2D.loadOml2d({
        models: MODELS,
        dockedPosition: 'left',
        mobileDisplay: false,
        primaryColor: '#39c5bb',
        sayHello: false,
        tips: {
          idleTips: {
            interval: 25000,
            message: [
              '要不要看看 C++ 的移动语义？',
              '右值引用那篇写得很细',
              '滚动条拉太长了，休息一下',
              '有不懂的可以直接留言'
            ]
          }
        }
      });
    } catch (e) {
      // 看板娘挂了不该影响正文
      console.warn('[live2d] 初始化失败:', e);
    }
  }

  function loadLib() {
    if (typeof OML2D !== 'undefined') {
      start();
      return;
    }
    var s = document.createElement('script');
    s.src = LIB;
    s.async = true;
    s.onload = start;
    s.onerror = function () {
      console.warn('[live2d] 组件加载失败，看板娘已跳过');
    };
    document.body.appendChild(s);
  }

  if (isMobile()) return;

  if (document.readyState === 'complete') {
    loadLib();
  } else {
    window.addEventListener('load', loadLib, { once: true });
  }
})();
