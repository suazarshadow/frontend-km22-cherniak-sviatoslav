
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".main-panel section");
    const links = document.querySelectorAll(".sidebar nav a");

    function showSection(id) {
        sections.forEach(sec => sec.classList.remove("active"));
        const target = document.querySelector(id);
        if (target) target.classList.add("active");
    }

    links.forEach(link => {
        link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        showSection(targetId);
        });
    });

    showSection("#dashboard");


    const groupButtons = document.querySelectorAll(".group-buttons button");
    const groupContents = document.querySelectorAll(".group-content");

    groupButtons.forEach(btn => {
        btn.addEventListener("click", function () {
        const target = this.getAttribute("data-target");
        groupContents.forEach(gc => gc.classList.remove("active"));
        const el = document.getElementById(target);
        if (el) el.classList.add("active");
        });
    });


  const form = document.querySelector(".match-form");
  const tableBody = document.querySelector("#matches tbody");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("match-date").value;
    const teamA = document.getElementById("team-a").value.trim();
    const teamB = document.getElementById("team-b").value.trim();
    const location = document.getElementById("location").value.trim();
    const status = document.getElementById("status").value;


    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${teamA}</td>
      <td>${teamB}</td>
      <td>${location}</td>
      <td>${status}</td>
      <td><a href="#">Редагувати</a></td>
    `;


    tableBody.appendChild(newRow);


    form.reset();
  });
});

