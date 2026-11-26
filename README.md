# 🕵️ Conan TCG Primer

**An unofficial, interactive guide to the Detective Conan Trading Card Game by Takara Tomy.**

Learn the rules, explore the cards and game board, try interactive rule checkers, and play a simplified practice match against a bot — all in your browser.

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

The **Detective Conan Trading Card Game (Conan TCG)** is a two-player trading card game in which players work with their Partner and characters to gather evidence and solve their cases before their opponent.

For new players, learning the game involves understanding card types, game areas, turn procedures, abilities, and Japanese terminology. This project makes that learning process easier through a guided, interactive browser experience.

Instead of presenting the rules as one long document, **Conan TCG Primer** introduces the game in a practical order: first the board and cards, then setup and turn structure, followed by the actions players can take during a match. It also provides a simplified practice game so players can try the mechanics as they learn.

## 🌐 Try the Primer

**[Open the GitHub repository](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game)**

Open [`index.html`](./index.html) in a modern web browser. No installation or account is required.

---

## ✨ Features

### 1. Practice Game Against a Bot

Try a simplified game against a basic bot using one of six starter decks. Choose the bot's deck or let it be selected randomly.

- Play cards and take available game actions.
- See which moves are currently unavailable.
- Read explanations for unavailable actions.
- Select characters on the Scene to inspect their abilities.
- Follow the game state as the match progresses.

The practice game is intended for learning the basic flow of play, not competitive or tournament-level simulation.

### 2. Interactive Game Board Guide

Explore the eight areas on a player's side of the board. Select an area to see what it contains and how it is used.

| Area | Purpose |
|---|---|
| **Scene** | Where characters enter play and perform deductions or Actions. |
| **Partner** | Holds your Partner card and its abilities. |
| **Case** | Tracks your case and whether it is in the Case phase or Solution phase. |
| **Evidence Area** | Holds the evidence you have collected. |
| **FILE Area** | Holds face-down cards that determine which character levels you can play. |
| **Deck** | Your main 40-card deck. |
| **Remove Area** | Holds removed cards and resolved Events; it is also used during Refresh. |
| **Hand** | Cards available to play. |

### 3. Card Types and Attributes

Learn the four card types used in Conan TCG:

- **Partner** — your partner in solving the case, with the shared Assist and Case Solved abilities.
- **Character** — enters the Scene and can perform deductions and Actions.
- **Event** — provides a one-time effect and is then placed in the Remove Area.
- **Case** — represents the case you must solve to win.

The guide also explains important character attributes:

| Attribute | Explanation |
|---|---|
| **Level** | Determines the FILE requirement for playing a character from your hand. |
| **AP** | Action Point, used to determine the order of play during a Contact. |
| **LP** | Logic Point, which determines how much evidence a character gains through deduction. |
| **Color** | A requirement for playing certain cards. |
| **ID** | Identifies whether cards count as the same card for deck-building restrictions. |

You can also review Active, Sleep, and Stun states, as well as parallel cards, reprints, and card-copy restrictions.

### 4. Setup and Turn-by-Turn Guide

Follow the preparation procedure and understand how a match progresses:

- Deck construction and card-copy limits.
- Choosing your Partner and Case.
- Preparing the game and drawing your opening hand.
- The Auto Phase, Main Phase, and End Phase.
- The special procedure on the first player's first turn.

An interactive stepper lets you move through the turn sequence one step at a time.

### 5. Main Phase Actions

Explore the actions available during the Main Phase through an interactive tabbed guide:

- Play a card from your hand.
- Use Next Hint.
- Declare Assist.
- Declare Case Solved.
- Activate card abilities.
- Deduce to collect evidence.
- Take an Action against an opposing character or case.

Each section explains the basic procedure and important restrictions.

### 6. Interactive Rule Checkers

Experiment with different game states to understand important requirements.

**Character Level Checker**

Adjust the number of cards in your FILE Area, choose whether you are playing from hand or using Next Hint, and account for your Partner after Assist. The checker shows which character levels are available.

**Case Solving Checker**

Set your Case level, evidence count, FILE count, Case phase, and Partner state to check whether you can declare Case Solved. It also explains whether Assist can move your Case into the Solution phase.

**Contact AP Calculator**

Compare the attacker's and defender's AP, including the example +2000 AP Cut-in bonus. The calculator explains the order in which players act during a Contact.

### 7. English–Japanese Glossary

Look up game terminology using the searchable glossary. It provides English explanations alongside Japanese terms, making it easier to connect the primer with Japanese cards and official documentation.

Additional explanations cover mechanics such as Refresh, MR cards, and card names containing multiple characters.

### 8. Rules Quiz

Review what you have learned with an interactive quiz. Use it to check your understanding of the rules and identify topics that may need another look.

---

## 🎴 Practice Decks

The practice environment currently includes six starter decks:

| Deck ID | Deck | Color |
|---|---|---|
| CT-D01 | Conan | Blue |
| CT-D07 | Black Organization | Black |
| CT-D02 | Heiji Hattori | Green |
| CT-D03 | Kaito Kid | White |
| CT-D04 | Shuichi Akai | Red |
| CT-D05 | Toru Amuro | Yellow |

You can choose a deck for your side and select the bot's deck, or leave the opponent's selection random.

---

## 🚀 Getting Started

### Use the primer directly

1. Open the [GitHub repository](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game).
2. Open `index.html`.
3. Download the file.
4. Open it in a modern browser.

### Run it locally

Clone the repository:

```bash
git clone https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game.git
cd Detective_Conan_Card_Game
```

Open `index.html` in your browser.

macOS:

```bash
open index.html
```

Windows:

```bash
start "" index.html
```

Linux:

```bash
xdg-open index.html
```

### Requirements

- A modern browser such as Chrome, Firefox, Safari, or Edge.
- An internet connection is recommended for externally hosted resources, including web fonts and card images.

The primer is a browser-based HTML resource. It does not require a backend server or a separate application installation.

---

## 🧰 Technology

The project uses standard web technologies:

| Technology | Role |
|---|---|
| **HTML5** | Page structure and learning content. |
| **CSS3** | Layout, responsive presentation, and visual styling. |
| **JavaScript** | Interactive guides, calculators, quiz, and practice-game logic. |

The page includes responsive layouts and supports light and dark color schemes.

---

## ⚠️ Scope and Limitations

Conan TCG Primer is a learning aid, not an official rules engine or a replacement for the physical game.

- **Simplified bot:** The opponent uses basic logic and is not designed for competitive play.
- **Limited card interactions:** The practice environment does not implement every official mechanic or card effect.
- **Paraphrased card text:** Ability descriptions in the practice game are simplified. Refer to the physical card for exact wording.
- **Specific simplifications:** The current practice implementation does not model Disguise, and cards placed on the bottom of the deck are not tracked in their exact order.
- **Unofficial translations:** English glossary entries are learning aids and are not official translations.

The primer references **Takara Tomy's Official Rule Manual, Version 2.6**. Rules, card text, and official rulings may change. When there is a discrepancy, always prioritize the latest official documentation and the text of the relevant card.

---

## 📚 Official Resources

For authoritative rules and product information, consult Takara Tomy's official resources:

- [Detective Conan Card Game — Official Website](https://www.takaratomy.co.jp/products/conan-cardgame/)
- [Official Rule Manual (Japanese PDF)](https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf)

The primer is designed to complement these materials and make the learning process more approachable.

---

## 🤝 Feedback and Contributions

Feedback from players is very welcome. If you find an incorrect explanation, encounter a bug, or have an idea for improving the primer, please share it.

You can contribute by:

- Reporting rule explanations that need correction.
- Identifying missing mechanics or card interactions.
- Reporting issues with the calculators, quiz, or practice game.
- Suggesting additional practice decks.
- Improving the English explanations and terminology.

To report a problem, open an [Issue](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game/issues) and describe it clearly. For rules-related reports, include the relevant official rule or card reference when possible.

To contribute code or content, fork the repository, create a branch, make and test your changes, and submit a Pull Request.

---

## 📄 License

This repository is distributed under the **Apache License 2.0**. See [`LICENSE`](./LICENSE) for the full license text.

The license applies to the original materials in this repository and does not grant rights to third-party intellectual property, including Detective Conan characters, trademarks, card artwork, or other materials owned by their respective rights holders.

---

## ⚖️ Disclaimer

This is an **unofficial, fan-made educational project**. It is not affiliated with, sponsored by, or endorsed by Takara Tomy, Shogakukan, TMS Entertainment, or any other Detective Conan rights holder.

Detective Conan, its characters, trademarks, card designs, and related intellectual property belong to their respective owners. This project is created for educational, informational, and fan-community purposes.

---

## 📬 Contact

**Author:** Quoc Chuong Nguyen

- **GitHub:** [ChuongQuoc1413017](https://github.com/ChuongQuoc1413017)
- **Repository:** [Detective Conan Card Game](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game)
- **Email:** chuong.nguyenquoc1413017@gmail.com

---

<p align="center">
  <b>Happy investigating, and good luck solving your cases!</b> 🔎
</p>
