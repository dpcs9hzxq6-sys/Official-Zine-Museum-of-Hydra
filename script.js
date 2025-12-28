// Password gate: appears only once per browser session; password is 888.
const PASSWORD = "888";
const SESSION_KEY = "ozmoh_unlocked_session_v1";

const gate = document.getElementById("gate");
const form = document.getElementById("gateForm");
const pw = document.getElementById("pw");

function showGate(){
  if (!gate) return;
  gate.classList.add("show");
  document.body.classList.add("locked");
  document.body.classList.remove("unlocked");
  gate.setAttribute("aria-hidden", "false");
  setTimeout(() => pw && pw.focus(), 60);
}
function hideGate(){
  if (!gate) return;
  gate.classList.remove("show");
  document.body.classList.remove("locked");
  document.body.classList.add("unlocked");
  gate.setAttribute("aria-hidden", "true");
}
function isUnlocked(){
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
function unlock(){
  sessionStorage.setItem(SESSION_KEY, "1");
  hideGate();
}

(function initGate(){
  document.body.classList.add("unlocked");
  if (gate){
    if (!isUnlocked()) showGate();
    else hideGate();
  }
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = (pw?.value || "").trim();
      if (entered === PASSWORD){
        unlock();
        if (pw) pw.value = "";
      } else {
        if (pw) pw.value = "";
        gate.animate(
          [{ transform: "translateX(0px)" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "translateX(0px)" }],
          { duration: 260, iterations: 1 }
        );
      }
    });
  }
})();

// Process page: reveal images slowly at an even interval in numeric order.
(function initProcessReveal(){
  const grid = document.getElementById("processGrid");
  if (!grid) return;
  const imgs = Array.from(grid.querySelectorAll(".process-img"))
    .sort((a,b) => Number(a.dataset.order) - Number(b.dataset.order));
  const intervalMs = 280; // even interval; adjust later if you want slower/faster
  imgs.forEach((img, idx) => {
    setTimeout(() => img.classList.add("revealed"), idx * intervalMs);
  });
})();

// Archive page: lightbox with soft blur + halo glow; close via X, click backdrop, ESC.
(function initLightbox(){
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !lightboxImg) return;

  function open(src){
    lightboxImg.src = src;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    // prevent background scroll
    document.documentElement.style.overflow = "hidden";
  }
  function close(){
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    document.documentElement.style.overflow = "";
    // clear src after animation tick
    setTimeout(() => { lightboxImg.src = ""; }, 50);
  }

  // Click thumbnails
  document.querySelectorAll(".zine-thumb").forEach((img) => {
    img.addEventListener("click", () => open(img.src));
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });

  // Click backdrop to close (but not image)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) close();
  });
})();
