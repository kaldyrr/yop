// Source JS for demo widget; build script converts this to YoptaScript into yopta/main.yopta
document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('demoInput');
  var btn = document.getElementById('demoBtn');
  var out = document.getElementById('demoOut');

  function say() {
    var v = (input.value || '').trim();
    if (!v) {
      out.textContent = 'Нечего сказать? Попробуйте ввести текст.';
      return;
    }
    var responses = [
      'Принято. Красиво сказано! ✨',
      'Готово. Ещё что-нибудь? 👇',
      'Окей! Передано во вселенную. 🌌'
    ];
    var rnd = responses[Math.floor(Math.random() * responses.length)];
    out.textContent = 'Ты сказал: “' + v + '”. ' + rnd;
  }

  btn.addEventListener('click', say);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') say();
  });
});

