const FLIP_DURATION = 400;
let container = document.querySelector(".container");
let blocks = Array.from(container.children);
let orderRange = Array.from(Array(blocks.length).keys());
let range = shuffle(orderRange);
let startTime, timerInterval;
let bestScore = localStorage.getItem("bestScore") || Infinity;
let playerName = "Unknown";

function startGame() {
  playerName = document.querySelector("#player-name").value.trim() || "Unknown";
  document.querySelector(".name span").textContent = playerName;
  document.querySelector(".start-button").style.display = "none";
  startTime = Date.now();
  timerInterval = setInterval(() => {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    let minutes = Math.floor(elapsed / 60);
    let seconds = elapsed % 60;
    document.querySelector(".timer span").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

blocks.forEach((block, index) => {
  block.style.order = range[index];
});

blocks.forEach((block) => {
  block.onclick = function () {
    if (block.classList.contains("clicked") || block.classList.contains("done")) return;
    block.classList.add("clicked");
    let flippedBlocks = blocks.filter((flippedblock) =>
      flippedblock.classList.contains("clicked")
    );
    if (flippedBlocks.length === 2) {
      stopClicking();
      if (
        flippedBlocks[0].getAttribute("club") ===
        flippedBlocks[1].getAttribute("club")
      ) {
        flippedBlocks.forEach((ele) => {
          ele.classList.remove("clicked");
          ele.classList.add("done");
        });
      } else {
        document.querySelector(".tries span").textContent++;
        setTimeout(() => {
          flippedBlocks.forEach((ele) => ele.classList.remove("clicked"));
        }, FLIP_DURATION);
      }
    }
    if (document.querySelectorAll(".box.done").length === blocks.length) {
      clearInterval(timerInterval);
      let tries = parseInt(document.querySelector(".tries span").textContent);
      let elapsed = Math.floor((Date.now() - startTime) / 1000);
      let minutes = Math.floor(elapsed / 60);
      let seconds = elapsed % 60;
      if (tries < bestScore) {
        bestScore = tries;
        localStorage.setItem("bestScore", bestScore);
      }
      setTimeout(() => {
        document.querySelector(".game-over").style.display = "flex";
        document.querySelector("#tries").textContent = tries;
        document.querySelector("#final-time").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        document.querySelector("#best-score").textContent = bestScore === Infinity ? "None" : bestScore;
      }, FLIP_DURATION);
    }
  };
});

function resetGame() {
  document.querySelector(".game-over").style.display = "none";
  document.querySelector(".tries span").textContent = "0";
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    let minutes = Math.floor(elapsed / 60);
    let seconds = elapsed % 60;
    document.querySelector(".timer span").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
  range = shuffle(orderRange);
  blocks.forEach((block, index) => {
    block.classList.remove("clicked", "done");
    block.style.order = range[index];
  });
  container.classList.remove("preventClicking");
}

//Functions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function stopClicking() {
  container.classList.add("preventClicking");
  setTimeout(() => {
    container.classList.remove("preventClicking");
  }, FLIP_DURATION);
}