// Playground runner for YoptaScript examples
(function(){
  function $(id){ return document.getElementById(id); }
  var select = $('exSelect');
  var code = $('exCode');
  var out = $('exOutput');
  var btnLoad = $('exLoad');
  var btnRun = $('exRun');
  var btnClear = $('exClear');

  if(!select || !code || !out || !btnLoad || !btnRun || !btnClear) return;

  function log(msg){
    out.textContent += (msg + "\n");
  }

  btnLoad.addEventListener('click', async function(){
    try{
      const url = select.value;
      const res = await fetch(url, { cache: 'no-store' });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const txt = await res.text();
      code.value = txt;
      out.textContent = 'Загружено: ' + url;
    }catch(e){
      out.textContent = 'Не удалось загрузить пример: ' + e.message;
    }
  });

  btnRun.addEventListener('click', function(){
    out.textContent = '';
    var src = code.value.trim();
    if(!src){ out.textContent = 'Пустой ввод'; return; }
    // Compile YoptaScript -> JS using runtime
    try{
      var compiled = (globalThis.yopta ? globalThis.yopta(src, 'ys') : src);
      // Capture console
      var original = { log: console.log, error: console.error };
      console.log = function(){ original.log.apply(console, arguments); log(Array.from(arguments).join(' ')); };
      console.error = function(){ original.error.apply(console, arguments); log('Ошибка: ' + Array.from(arguments).join(' ')); };
      try {
        // eslint-disable-next-line no-new-func
        new Function(compiled)();
        if(!out.textContent) log('Готово. Откройте консоль, если пример пишет туда.');
      } finally {
        console.log = original.log; console.error = original.error;
      }
    }catch(e){
      log('Компиляция/исполнение не удалось: ' + e.message);
    }
  });

  btnClear.addEventListener('click', function(){ out.textContent=''; });
})();
