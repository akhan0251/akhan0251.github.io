<div class="site">
  <header class="hero-card">
    <p class="nameplate">Ali Khan</p>
    <p class="kicker">AI Product Strategy | Machine Learning • Data Science • Industrial Engineering</p>
    <h1>Building practical tools at the intersection of AI, operations, and product.</h1>
    <p class="lede type-target" data-typing-target data-fulltext="I turn ambiguous operational problems into usable products, blending customer insight, data science, simulation, and hands-on prototyping to help teams make clearer decisions.">I turn ambiguous operational problems into usable products, blending customer insight, data science, simulation, and hands-on prototyping to help teams make clearer decisions.</p>
    <div class="hero-actions">
      <a class="button primary" href="https://www.linkedin.com/in/ali-khan1/" target="_blank" rel="noopener">LinkedIn</a>
      <a class="button ghost" href="https://github.com/akhan0251/akhan0251.github.io" target="_blank" rel="noopener">GitHub</a>
      <a class="button ghost" href="projects/">Projects</a>
    </div>
  </header>
</div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector("[data-typing-target]");
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
  });
</script>
