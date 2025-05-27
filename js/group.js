document.addEventListener("DOMContentLoaded", () => {
      const buttons = document.querySelectorAll('.group-tabs button');
      const views = document.querySelectorAll('.group-view');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const target = btn.dataset.target;
          views.forEach(view => view.classList.remove('active'));
          document.getElementById(target).classList.add('active');
        });
      });

      buttons[0].click();
});