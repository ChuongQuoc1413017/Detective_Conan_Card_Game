# 🕵️ Conan TCG Primer

<p align="center">
  <img src="logo.jpeg" alt="Detective Conan Card Game logo" width="600">
</p>

**An unofficial, beginner-friendly guide to the Detective Conan Trading Card Game by Takara Tomy.**

Learn the rules one small step at a time, watch a demo match, then play a simplified practice game against a bot, all in your browser and in **English or Vietnamese**.

<p align="center">
  <a href="https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github" alt="GitHub repository">
  </a>
  <img src="https://img.shields.io/badge/Project-Unofficial-blue" alt="Unofficial project">
  <img src="https://img.shields.io/badge/License-Apache%202.0-green" alt="Apache 2.0 license">
  <img src="https://img.shields.io/badge/Platform-Web%20Browser-orange" alt="Web browser">
</p>

---

## 📌 Overview

The **Detective Conan Trading Card Game (Conan TCG)** is a two-player card game. Players work with their Partner and characters to gather evidence and solve their case before their opponent does.

This primer is made for **children and first-time players**. Instead of one long page, it is split into short pages with a clear order, large buttons, a cute light brown brick theme, and extra detail folded away until you want it.

## 🚀 Getting Started

1. Open the [GitHub repository](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game).
2. Download it (**Code → Download ZIP**) and unzip it, or clone it:

```bash
git clone https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game.git
```

3. Open `index.html` in a modern browser (Chrome, Firefox, Safari or Edge).

No installation, account or server is needed. Keep the whole folder together, because the pages share files and card images. An internet connection is only needed for the web fonts and external links.

If you prefer to use a local web server, run this inside the project folder and visit `http://localhost:8765`:

```bash
python3 -m http.server 8765
```

---

## 🗺️ Learning Path

| Step | Page | What you will do |
|---|---|---|
| Start | `index.html` | See how to win and choose where to go. |
| 1 | `board.html` | Meet the eight table areas, the four card types and the card states. |
| 2 | `turn.html` | Step through a turn, learn setup, and check which card levels you can play. |
| 3 | `actions.html` | Learn the Main phase moves, check whether you can win, and compare AP in a Contact. |
| 4 | `demo.html` | Watch a whole match, one step at a time. |
| 5 | `practice.html` | Play against the bot. |
| 6 | `quiz.html` | Test what you remember. |
| Anytime | `words.html` | Search the English and Japanese glossary (Vietnamese in VI mode). |
| Anytime | `about.html` | Contact the author. |

Use the **EN / VI** buttons in the top bar to change language. Your choice is remembered in your browser.

---

## ✨ Features

### 🎬 Demo Match

Follow one player from the opening hand to **“Case Solved!”** in 24 steps. The blue Conan deck plays against the black deck.

- Move with **Back**, **Next**, the arrow keys, or **Auto play**.
- Each step explains what happens in simple words.
- A glowing box shows what just changed on the table.

The demo is a teaching story: the card order is chosen in advance and some card effects are skipped.

### 🎮 Practice Game

Play a simplified match against a basic bot.

- Choose one of six starter decks, and pick the bot's deck or leave it random.
- Unavailable moves are greyed out, with the reason shown.
- Inspect cards, read the game log and view the Remove area.

### 🧮 Rule Helpers

| Helper | Page | Question it answers |
|---|---|---|
| Level check | `turn.html` | Can I play this card? |
| Case checker | `actions.html` | Can I win this turn? |
| AP calculator | `actions.html` | What happens in this Contact? |

### 📖 Glossary and Advanced Rules

Search game terms next to their Japanese names. Refresh, MR cards and multi-character names are explained in a separate fold-out section.

### ⭐ Rules Quiz

Answer one question at a time, with an explanation after each. Your best score is saved in your browser.

---

## 🎴 Practice Decks

| Deck ID | Deck | Color |
|---|---|---|
| CT-D01 | Conan | Blue |
| CT-D02 | Heiji Hattori | Green |
| CT-D03 | Kid the Phantom Thief | White |
| CT-D04 | Shuichi Akai | Red |
| CT-D05 | Toru Amuro | Yellow |
| CT-D07 | Black Organization | Black |

---

## 🧰 Project Structure

The project uses plain HTML, CSS and JavaScript, with no build step or framework.

```text
.
├── index.html, board.html, turn.html, actions.html, demo.html,
│   practice.html, quiz.html, words.html, about.html
├── assets/
│   ├── style.css      Shared light brown brick theme
│   ├── site.js        Language switch, guides, helpers, glossary and quiz
│   └── demo.js        Demo match steps and table
├── practice.js        Practice game and bot
├── Card_List/         Card images, one folder per deck
└── logo.jpeg          Site logo and browser tab icon
```

### Editing tips

- **Page text** is in each `.html` file. The top bar and footer are repeated on every page, so change them in all pages.
- **Vietnamese text** for newer content sits in a `data-vi` attribute next to the English. Older lesson text is translated in `assets/site.js`, matched by the exact English wording, so update both together.
- **Demo steps** are the `STEPS` list in `assets/demo.js`. If you change a step, check the evidence, FILE, hand and deck counts that follow it.

---

## ⚠️ Scope and Limitations

This is a learning aid, not an official rules engine or a replacement for the physical game.

- **Simplified bot:** the opponent uses basic logic and is not designed for competitive play.
- **Limited card interactions:** not every official mechanic or card effect is implemented.
- **Practice simplifications:** Disguise is not modelled, and cards put on the bottom of the deck are not kept in exact order.
- **Paraphrased card text:** check the physical card for exact wording.
- **Unofficial translations:** the English and Vietnamese wording is not official.

The primer references **Takara Tomy's Official Rule Manual, Version 2.6**. Rules and rulings may change. If anything differs, follow the latest official documents and the card text.

## 📚 Official Resources

- [Detective Conan Card Game — Official Website](https://www.takaratomy.co.jp/products/conan-cardgame/)
- [Official Rule Manual (Japanese PDF)](https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf)

---

## 🤝 Feedback and Contributions

Feedback is very welcome, especially from new players. You can:

- report a rule explanation or translation that needs correction,
- report a problem with the demo, helpers, quiz or practice game,
- suggest more practice decks or card interactions.

Open an [Issue](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game/issues) and include the relevant rule or card reference when possible. To contribute code or content, fork the repository, create a branch, test your changes and submit a Pull Request.

## 📄 License

This repository is distributed under the **Apache License 2.0**. See [`LICENSE`](./LICENSE) for the full text.

The license covers the original materials in this repository only. It does not grant rights to third-party intellectual property, including Detective Conan characters, trademarks, logos or card artwork.

## ⚖️ Disclaimer

This is an **unofficial, fan-made educational project**. It is not affiliated with, sponsored by, or endorsed by Takara Tomy, Shogakukan, TMS Entertainment, or any other Detective Conan rights holder. Detective Conan and its related intellectual property belong to their respective owners.

## 📬 Contact

**Author:** Quoc Chuong Nguyen

- **GitHub:** [ChuongQuoc1413017](https://github.com/ChuongQuoc1413017)
- **Email:** chuong.nguyenquoc1413017@gmail.com

---

<p align="center">
  <b>Happy investigating, and good luck solving your cases!</b> 🔎
</p>
