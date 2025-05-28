document.addEventListener("DOMContentLoaded", () => {
    const teamSelect = document.getElementById("teamFilter");
    const positionSelect = document.getElementById("positionFilter");
    const cards = document.querySelectorAll(".player-card");

    function filterPlayers() {
    const selectedTeam = teamSelect.value;
    const selectedPosition = positionSelect.value;

    cards.forEach(card => {
        const team = card.dataset.team;
        const position = card.dataset.position;

        const teamMatch = selectedTeam === "all" || team === selectedTeam;
        const positionMatch = selectedPosition === "all" || position === selectedPosition;

        if (teamMatch && positionMatch) {
        card.style.display = "block";
        } else {
        card.style.display = "none";
        }
    });
    }

    teamSelect.addEventListener("change", filterPlayers);
    positionSelect.addEventListener("change", filterPlayers);
});