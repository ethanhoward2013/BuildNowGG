console.log("Loaded index.js");

document.addEventListener("DOMContentLoaded", function () {
  const otherGamesButton = document.getElementById("otherGamesButton");
  const themeButton = document.getElementById("themeButton");
  const lightIcon = document.getElementById("lightIcon");
  const darkIcon = document.getElementById("darkIcon");
  const loadingText = document.getElementById("loadingText");
  const loadingBar = document.getElementById("loadingBar");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      lightIcon.classList.add("hidden");
      darkIcon.classList.remove("hidden");
    } else {
      lightIcon.classList.remove("hidden");
      darkIcon.classList.add("hidden");
    }
    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("dark");
  }

  let currentContent = loadingText.innerHTML;

  function handleLoaderTextChange(mutationsList, observer) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "subtree") {
        const newContent = loadingText.innerHTML;
        if (newContent !== currentContent) {
          currentContent = newContent;
          const parts = newContent.split(":");
          const lastPart = parts[parts.length - 1].trim();
          rawPercent = lastPart.replace("%", "").trim();
          if (isNaN(rawPercent) || parseInt(rawPercent) !== Number(rawPercent)) {
            observer.disconnect();
            console.log("Disconnected the observer.");
            return;
          }
          loadingBar.value = rawPercent;
        }
      }
    });
  }

  const observer = new MutationObserver(handleLoaderTextChange);
  const config = { childList: true, subtree: true };
  observer.observe(loadingText, config);

  themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  otherGamesButton.addEventListener("click", () => {
    const url = "/games/";
    window.open(url, "_blank").focus();
  });

  // Create Mod Menu
  const modMenu = document.createElement("div");
  modMenu.style.position = "fixed";
  modMenu.style.top = "10px";
  modMenu.style.right = "10px";
  modMenu.style.background = "rgba(0, 0, 0, 0.8)";
  modMenu.style.color = "white";
  modMenu.style.padding = "10px";
  modMenu.style.borderRadius = "5px";
  modMenu.style.zIndex = "1000";
  modMenu.style.fontFamily = "Arial, sans-serif";
  modMenu.innerHTML = `
      <h3 style="margin: 0 0 10px; text-align: center;">Mod Menu</h3>
      <button id="aimbotButton" style="display: block; width: 100%; margin-bottom: 5px;">Enable Aimbot</button>
      <button id="flyButton" style="display: block; width: 100%; margin-bottom: 5px;">Enable Fly</button>
      <button id="espButton" style="display: block; width: 100%; margin-bottom: 5px;">Enable ESP</button>
  `;
  document.body.appendChild(modMenu);

  // Add Mod Menu Actions
  document.getElementById("aimbotButton").addEventListener("click", enableAimbot);
  document.getElementById("flyButton").addEventListener("click", enableFly);
  document.getElementById("espButton").addEventListener("click", enableESP);

  // Aimbot Logic
  function enableAimbot() {
    const aimbotEnabled = true; // Set to true to enable the aimbot

    if (aimbotEnabled) {
      // Detect closest player and set aim to their position
      setInterval(() => {
        const player = getClosestPlayer(); // Assuming you have a function that gets the closest player
        if (player) {
          aimAt(player); // Assuming you have a function to aim at a player
        }
      }, 50); // Update aim every 50ms
    }
  }

  function getClosestPlayer() {
    // Logic to find the closest player
    // You'll need to reference the in-game player positions for this to work
    return closestPlayer; // Placeholder for actual logic
  }

  function aimAt(player) {
    // Logic to aim at a player
    // This would set the weapon's aim to the player's coordinates
    weapon.aimAt(player.x, player.y); // Placeholder
  }

  // Fly Mod Logic
  function enableFly() {
    const flyEnabled = true; // Set to true to enable fly mode

    if (flyEnabled) {
      document.addEventListener("keydown", function (event) {
        if (event.key === "f") { // Press "F" to toggle fly mode
          toggleFly();
        }
      });

      let isFlying = false;

      function toggleFly() {
        isFlying = !isFlying;
        if (isFlying) {
          enableFlyingMode();
        } else {
          disableFlyingMode();
        }
      }

      function enableFlyingMode() {
        // Logic to disable gravity and enable free movement in the air
        player.gravity = 0; // Placeholder to disable gravity
        document.addEventListener("mousemove", onFlyMove);
      }

      function disableFlyingMode() {
        // Logic to reset gravity and disable flying mode
        player.gravity = 1; // Restore gravity to normal
        document.removeEventListener("mousemove", onFlyMove);
      }

      function onFlyMove(event) {
        // Logic to move the player in the air based on mouse movement or keyboard
        player.x += event.movementX; // Adjust player position based on mouse movement
        player.y += event.movementY;
      }
    }
  }

  // ESP (Wallhack) Logic
  function enableESP() {
    const espEnabled = true; // Set to true to enable ESP

    if (espEnabled) {
      setInterval(() => {
        const players = getPlayers(); // Assuming you have a function to get all players
        players.forEach(player => {
          drawESP(player);
        });
      }, 50); // Update ESP every 50ms
    }

    function getPlayers() {
      // Logic to return all players in the game
      return allPlayers; // Placeholder for actual logic
    }

    function drawESP(player) {
      // Logic to render ESP (like a box or line) around the player
      const ctx = document.querySelector("canvas").getContext("2d");
      ctx.strokeStyle = "red"; // Set the ESP color
      ctx.lineWidth = 3;
      ctx.strokeRect(player.x - 25, player.y - 25, 50, 50); // Draw a rectangle around the player
    }
  }
});
