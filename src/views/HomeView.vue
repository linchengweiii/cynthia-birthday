<template>
  <main class="home-shell">
    <div class="orb orb-pink" />
    <div class="orb orb-green" />

    <section class="profile">
      <div class="avatar" aria-hidden="true"><span>🎂</span></div>

      <h1>Cynthia's Birthday</h1>
      <p class="intro">一起收藏每一年的生日回憶 ✨</p>

      <nav class="links" aria-label="生日年份">
        <a href="#/2026" class="memory-link link-2026">
          <span class="link-icon" aria-hidden="true">🌱</span>
          <span class="link-copy">
            <strong>2026 Birthday</strong>
            <small>Pikmin 散步旅程</small>
          </span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>

        <a href="#/2024" class="memory-link link-2024">
          <span class="link-icon" aria-hidden="true">📷</span>
          <span class="link-copy">
            <strong>2024 Birthday</strong>
            <small>我們的第一年</small>
          </span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </nav>

      <p class="footer-note">Made with love <span aria-hidden="true">♥</span></p>
    </section>
  </main>
</template>

<style scoped>
.home-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #fff8f5 0%, #fffdf9 45%, #f7fee7 100%);
  color: #3f3a40;
  font-family: ui-rounded, "SF Pro Rounded", "Noto Sans TC", system-ui, sans-serif;
}

.home-shell::before {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(225 122 136 / 20%) 1px, transparent 1px);
  background-size: 22px 22px;
  content: "";
  mask-image: linear-gradient(to bottom, black, transparent 75%);
}

.orb {
  position: absolute;
  width: 22rem;
  height: 22rem;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.3;
}

.orb-pink { left: -10rem; top: -8rem; background: #fda4af; }
.orb-green { bottom: -10rem; right: -10rem; background: #bef264; }

.profile {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
  width: min(100%, 42rem);
  margin: 0 auto;
  padding: 4.5rem 1.25rem 2rem;
  align-items: center;
  flex-direction: column;
}

.avatar {
  display: grid;
  width: 6.5rem;
  height: 6.5rem;
  place-items: center;
  border: 4px solid rgb(255 255 255 / 90%);
  border-radius: 999px;
  background: linear-gradient(145deg, #ffe4e6, #fecdd3);
  box-shadow: 0 14px 35px rgb(136 70 80 / 18%);
}

.avatar span { font-size: 3.5rem; transform: translateY(-1px); }

h1 {
  margin: 1.25rem 0 0;
  font-size: clamp(1.8rem, 7vw, 2.4rem);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.intro {
  margin: 1rem 0 0;
  color: #70676f;
  font-size: 1rem;
  text-align: center;
}

.links {
  display: grid;
  width: 100%;
  margin-top: 2.25rem;
  gap: 1rem;
}

.memory-link {
  display: grid;
  min-height: 5.5rem;
  padding: 0.8rem 1rem;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 85%);
  border-radius: 1.25rem;
  box-shadow: 0 10px 28px rgb(78 59 65 / 10%);
  color: #3f3a40;
  gap: 0.9rem;
  grid-template-columns: 3.25rem 1fr 1.5rem;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.link-2026 { background: rgb(247 254 231 / 88%); }
.link-2024 { background: rgb(255 241 242 / 88%); }

.memory-link:hover,
.memory-link:focus-visible {
  border-color: white;
  box-shadow: 0 15px 35px rgb(78 59 65 / 16%);
  outline: none;
  transform: translateY(-3px) scale(1.01);
}

.link-icon {
  display: grid;
  width: 3.25rem;
  height: 3.25rem;
  place-items: center;
  border-radius: 1rem;
  background: rgb(255 255 255 / 72%);
  font-size: 1.75rem;
}

.link-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.link-copy strong { font-size: 1.05rem; font-weight: 850; }

.link-copy small {
  overflow: hidden;
  color: #7c727a;
  font-size: 0.82rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 1.25rem;
  font-weight: 800;
  transition: transform 180ms ease;
}

.memory-link:hover .arrow,
.memory-link:focus-visible .arrow { transform: translateX(4px); }

.footer-note {
  margin: auto 0 0;
  padding-top: 3rem;
  color: #9b8d96;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer-note span { color: #e97887; }

@media (max-width: 420px) {
  .profile { padding-top: 3rem; }
  .avatar { width: 5.5rem; height: 5.5rem; }
  .avatar span { font-size: 3rem; }
}
</style>
