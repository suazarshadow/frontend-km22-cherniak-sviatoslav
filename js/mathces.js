 document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.tab-button');
      const contents = document.querySelectorAll('.tab-content');

      tabs.forEach(button => {
        button.addEventListener('click', () => {
          const target = button.dataset.target;

          contents.forEach(content => content.classList.remove('active'));
          document.getElementById(target).classList.add('active');

          tabs.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
        });
      });

      tabs[0].click();
    });