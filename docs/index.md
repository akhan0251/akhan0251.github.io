<div class="site">
  <header class="hero-card">
    <p class="nameplate">Ali Khan</p>
    <p class="kicker">AI Product Strategy | Machine Learning • Data Science • Industrial Engineering</p>
    <h1>Product manager turning complexity into clarity.</h1>
    <p class="lede type-target" data-typing-target data-fulltext="I bridge customer insight with simple, effective tools, staying results-focused and creative so teams stay aligned and provide better customer experiences.">I bridge customer insight with simple, effective tools, staying results-focused and creative so teams stay aligned and provide better customer experiences.</p>
    <div class="hero-actions">
      <a class="button primary" href="https://www.linkedin.com/in/ali-khan1/" target="_blank" rel="noopener">LinkedIn</a>
      <a class="button ghost" href="https://github.com/akhan0251" target="_blank" rel="noopener">GitHub</a>
      <button class="button ghost" type="button" data-typing-replay>Animate line</button>
    </div>
  </header>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector("[data-typing-target]");
    const replayBtn = document.querySelector("[data-typing-replay]");
    if (!target) return;

    const fullText = target.dataset.fulltext || target.textContent.trim();
    let timer;

    const runTyping = () => {
      clearInterval(timer);
      target.textContent = "";
      target.classList.add("typing");
      let i = 0;
      timer = setInterval(() => {
        target.textContent = fullText.slice(0, i);
        i += 1;
        if (i > fullText.length) {
          clearInterval(timer);
          target.classList.remove("typing");
          target.textContent = fullText;
        }
      }, 26);
    };

    runTyping();
    if (replayBtn) replayBtn.addEventListener("click", runTyping);
  });
</script>
