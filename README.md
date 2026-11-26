# 🕵️ Detective Conan Card Game (TCG)

**An unofficial interactive learning and practice resource for the Detective Conan Card Game published by Takara Tomy.**

Learn the rules, understand the game mechanics, explore card interactions, and practice playing through an interactive browser-based tutorial.

<p align="center">
  <a href="https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github" alt="GitHub Repository">
  </a>
  <img src="https://img.shields.io/badge/Project-Unofficial-blue" alt="Unofficial Project">
  <img src="https://img.shields.io/badge/License-Apache%202.0-green" alt="Apache 2.0 License">
  <img src="https://img.shields.io/badge/Platform-Web%20Browser-orange" alt="Web Browser">
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Getting Started](#-getting-started)
- [Features](#-features)
  - [1. Interactive Game Board Guide](#1-interactive-game-board-guide)
  - [2. Card Types and Card Attributes](#2-card-types-and-card-attributes)
  - [3. Game Setup and Deck Construction](#3-game-setup-and-deck-construction)
  - [4. Turn Structure and Game Mechanics](#4-turn-structure-and-game-mechanics)
  - [5. Interactive Game Calculators](#5-interactive-game-calculators)
  - [6. Contact and AP Calculator](#6-contact-and-ap-calculator)
  - [7. Game Terminology and Glossary](#7-game-terminology-and-glossary)
  - [8. Practice Game Against a Bot](#8-practice-game-against-a-bot)
  - [9. Rules Quiz](#9-rules-quiz)
- [Supported Practice Decks](#-supported-practice-decks)
- [Who Is This Project For?](#-who-is-this-project-for)
- [Project Structure](#-project-structure)
- [Installation and Local Usage](#-installation-and-local-usage)
- [Limitations and Accuracy](#-limitations-and-accuracy)
- [Official Resources](#-official-resources)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#-disclaimer)
- [Contact](#-contact)

---

## 🔍 About the Project

The **Detective Conan Card Game (Conan TCG)** is a collectible trading card game published by **Takara Tomy**, based on the Detective Conan (Case Closed) franchise.

For new players, learning the game can be challenging due to its different card types, game zones, turn phases, character abilities, and specific terminology.

This project aims to make the learning process more accessible through an interactive, browser-based learning environment.

Rather than providing only a static rulebook, this repository offers a collection of learning tools that allow players to:

- Understand the game board and the purpose of each playing area.
- Learn how different card types and attributes work.
- Follow the game setup and turn sequence step by step.
- Explore important game mechanics through interactive examples.
- Practice playing with simplified starter decks against a basic AI opponent.
- Test their understanding through a rules quiz.

The learning materials are organized in the order that players typically encounter the rules during an actual game, making the resource suitable for beginners as well as players who need a quick reference.

**Main resource:** [`index.html`](./index.html)

---

## 🚀 Getting Started

There are two ways to use this project.

### Option 1: Open the Interactive Primer

1. Visit this repository.
2. Open `index.html`.
3. Download the HTML file.
4. Open it using a modern web browser.

The primer runs directly in the browser and does not require installing additional software or setting up a development environment.

### Option 2: Run Locally

Clone the repository:

```bash
git clone https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game.git
```

Navigate to the project directory:

```bash
cd Detective_Conan_Card_Game
```

Open the HTML file:

```bash
open "index.html"
```

On Windows, you can also double-click the HTML file or run:

```bash
start "" "index.html"
```

On Linux:

```bash
xdg-open "index.html"
```

No Node.js, Python environment, package manager, or external game engine is required.

---

## ✨ Features

### 1. Interactive Game Board Guide

Understand the layout of a player's game board through an interactive visual representation.

The board is divided into eight areas:

| Area | Description |
|---|---|
| Scene | Where characters are played and participate in the game. |
| Partner | Holds your Partner card and supports important game actions. |
| Case | Contains your Case card and tracks the current case phase. |
| Evidence Area | Holds evidence cards collected during the game. |
| FILE Area | Stores face-down cards used to determine which character levels you can play. |
| Deck | Your main deck of cards. |
| Remove Area | Holds removed cards and used Events. |
| Hand | Cards available for you to play. |

Click any area in the interactive board to learn about its function and how cards interact with it.

### 2. Card Types and Card Attributes

Learn about the four fundamental card types:

- **Partner:** Your partner in solving the case. It supports abilities such as Assist and Case Solved, and can also perform deductions.
- **Character:** Characters enter the Scene and participate in deductions, Contacts, and other actions.
- **Event:** Cards that produce one-time effects when played.
- **Case:** Represents the case you must solve to win the game.

The primer also explains important character attributes:

| Attribute | Meaning |
|---|---|
| Level | Determines the FILE requirement for playing a character. |
| AP | Action Point, used when comparing characters during a Contact. |
| LP | Logic Point, determines the amount of evidence obtained through deduction. |
| Color | Determines the color requirements for playing certain cards. |
| ID | Identifies a card and determines whether two cards count as the same card. |

Additional explanations cover:

- Card states: Active, Sleep, and Stun.
- Parallel cards and reprints.
- Card identification and copy restrictions.
- How card attributes affect gameplay.

### 3. Game Setup and Deck Construction

Learn how to prepare for a match, including:

- Deck construction requirements.
- Card copy restrictions.
- Partner and Case selection.
- Initial game setup.
- First-player determination.
- Initial hand and redraw procedure.

The primer explains the relationship between the main deck, Partner card, and Case card so that new players can prepare for their first match.

### 4. Turn Structure and Game Mechanics

Understand the structure of a normal turn.

Each turn consists of three major phases:

1. **Auto Phase:** Activate cards, draw cards, and place cards into the FILE area.
2. **Main Phase:** Play characters, use Events, perform deductions, and take other available actions.
3. **End Phase:** Complete the remaining procedures and finish the turn.

An interactive step-by-step guide explains the individual procedures within each phase.

The tutorial also covers important mechanics, including:

- Playing characters from your hand.
- Using the FILE area to satisfy card-level requirements.
- Performing deductions to obtain evidence.
- Using Partner abilities.
- Switching characters in the Scene.
- Taking Actions against opposing characters.
- Understanding the conditions required to solve a Case.

### 5. Interactive Game Calculators

The primer includes small interactive tools that help players understand important numerical requirements.

**Character Level Checker**

Experiment with different FILE configurations to determine which character levels can be played.

You can adjust:

- The number of cards in your FILE area.
- Whether the character is played from hand or through Next Hint.
- Whether your Partner is currently in the FILE area following an Assist.

The tool then displays the corresponding playable levels.

**Case Solving Checker**

Check whether your current game state satisfies the requirements for declaring Case Solved.

You can configure:

- Case level.
- Number of evidence cards.
- Number of cards in your FILE area.
- Current Case phase.
- Partner status.

The calculator evaluates the supplied conditions and explains whether the winning action is available.

### 6. Contact and AP Calculator

Learn how character interactions work during a Contact.

The interactive calculator allows you to compare:

- Attacking character AP.
- Defending character AP.
- Additional AP from Cut-in effects.

It then displays the resulting comparison and helps explain the interaction between attacking and defending characters.

This is particularly useful for understanding one of the important combat-related mechanics of Conan TCG.

### 7. Game Terminology and Glossary

The primer includes a searchable glossary of important game terminology.

It is designed to help players understand English explanations while recognizing the corresponding Japanese terminology printed in official materials.

Features include:

- Searchable game terms.
- English explanations.
- Corresponding Japanese terminology.
- Additional explanations of specific mechanics, including Refresh and MR cards.

This section is especially useful for players learning the game using Japanese-language official resources.

### 8. Practice Game Against a Bot

The project includes a simplified playable practice environment where you can play a complete game against a basic bot.

Players can:

- Select one of the available starter decks.
- Choose the opponent's deck or leave it randomized.
- Play characters and use available actions.
- Follow the game progression.
- Receive explanations when certain actions are unavailable.
- Select characters in the Scene to inspect their abilities.

The practice environment is intended to help beginners become familiar with the basic gameplay loop and the relationship between different game mechanics.

**Important:** The bot is a simplified practice opponent, not a competitive AI. Some mechanics and card interactions are not fully implemented.

### 9. Rules Quiz

Test your understanding of the rules through an interactive quiz.

The quiz provides an opportunity to review concepts covered throughout the primer and identify areas that may require further study.

It can be used as a self-assessment tool after completing the tutorial.

---

## 🎴 Supported Practice Decks

The current practice environment includes six starter decks:

| Deck ID | Deck Name | Color |
|---|---|---|
| CT-D01 | Conan | Blue |
| CT-D07 | Black Organization | Black |
| CT-D02 | Heiji Hattori | Green |
| CT-D03 | Kid the Phantom Thief | White |
| CT-D04 | Akai | Red |
| CT-D05 | Amuro | Yellow |

These decks provide different starting points for exploring the basic gameplay mechanics.

Note that the practice game uses simplified card ability descriptions and does not reproduce every interaction in the official physical game.

---

## 🎯 Who Is This Project For?

This project is intended for several groups of players.

**New Players**

If you have never played Conan TCG before, the primer provides a structured introduction to the game, from understanding the board to learning the turn sequence.

**Existing Players**

Players who already understand the basics can use the interactive calculators, glossary, and individual rule explanations as quick references.

**Players Learning from Japanese Materials**

The glossary helps connect English explanations with Japanese terminology, making it easier to navigate the official Japanese rulebook.

**Casual Practice**

The simplified practice game offers an opportunity to explore basic gameplay without requiring another human player.

---

## 📁 Project Structure

The repository currently has a deliberately lightweight structure:

```text
Detective_Conan_Card_Game/
│
├── index.html
│   └── Interactive learning and practice environment
│
├── README.md
│   └── Project documentation
│
└── LICENSE
    └── Apache License 2.0
```

The interactive primer is implemented as a standalone HTML resource containing its own styling and JavaScript functionality.

---

## 🛠 Installation and Local Usage

### Requirements

- A modern web browser (Chrome, Firefox, Safari, or Edge).
- An internet connection for externally hosted resources such as web fonts, if needed.

### Technologies

The current project uses standard web technologies:

| Technology | Purpose |
|---|---|
| HTML5 | Structure and content of the learning environment. |
| CSS3 | Layout, responsive design, and visual presentation. |
| JavaScript | Interactive learning tools, calculators, quiz, and practice game. |

There is currently no backend server, database, or external JavaScript framework required to run the primer.

---

## ⚠️ Limitations and Accuracy

This project is an independent learning resource and should not be considered a replacement for the official rulebook.

The following limitations should be kept in mind:

1. **Unofficial explanations:** Some English descriptions are simplified or paraphrased to make the rules easier to understand.
2. **Practice game:** The bot and its gameplay logic are simplified. Not all official mechanics are implemented.
3. **Card abilities:** Individual card text and special effects may introduce exceptions that are not covered by the general tutorial.
4. **Rule updates:** The primer is based on the official Takara Tomy rule manual, Version 2.6, referenced during its development. Players should check for newer official rules and rulings.
5. **Translation:** English terminology and explanations are provided as learning aids. They should not be treated as official translations.

When a discrepancy occurs, always prioritize the latest official rules, official card text, and rulings published by Takara Tomy.

---

## 📚 Official Resources

The following resources are useful for learning more about the game.

| Resource | Description |
|---|---|
| [Takara Tomy – Detective Conan Card Game](https://www.takaratomy.co.jp/products/conan-cardgame/) | Official game website. |
| [Official Rule Manual (Japanese PDF)](https://www.takaratomy.co.jp/products/conan-cardgame/pdf/rule/rule_manual.pdf) | Official rules and gameplay procedures. |
| [Official Card Game Information](https://www.takaratomy.co.jp/products/conan-cardgame/) | Official product and game information. |

**Recommendation:** Use this repository alongside the official rule manual. The primer is intended to make the rules easier to learn, while the official manual remains the authoritative reference.

---

## 🤝 Contributing

Contributions, suggestions, and corrections are welcome!

There are several ways to help improve this project:

- Report incorrect rule explanations.
- Suggest improvements to the learning materials.
- Identify missing game mechanics.
- Report bugs in interactive calculators or the practice game.
- Suggest additional starter decks.
- Improve the English explanations and terminology.
- Suggest new interactive tools for learning the game.

### Reporting an Issue

If you find an error or have a suggestion:

1. Visit the [Issues](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game/issues) page.
2. Create a new issue.
3. Clearly describe the problem or proposed improvement.
4. When applicable, include the relevant official rule or card reference.

### Submitting a Contribution

1. Fork this repository.
2. Create a new branch.
3. Make your changes.
4. Test the HTML resource in a modern browser.
5. Submit a Pull Request describing your changes.

Please ensure that rule-related contributions are supported by official documentation or card text whenever possible.

---

## 📄 License

This repository is distributed under the **Apache License 2.0**.

See the [LICENSE](./LICENSE) file for the full license text.

The license applies to the original materials in this repository, subject to applicable third-party intellectual property rights. It does not grant rights to Detective Conan characters, trademarks, card artwork, or other copyrighted materials owned by their respective rights holders.

---

## ⚖️ Disclaimer

This is an **unofficial, fan-created educational project**.

It is not affiliated with, sponsored by, or endorsed by Takara Tomy, Shogakukan, TMS Entertainment, or any other Detective Conan rights holder.

Detective Conan, its characters, trademarks, card designs, and related intellectual property belong to their respective owners.

This project is created solely for educational, informational, and fan-community purposes.

---

## 📬 Contact

**Author:** Quoc Chuong Nguyen

For questions, suggestions, corrections, or collaboration:

- **GitHub:** [ChuongQuoc1413017](https://github.com/ChuongQuoc1413017)
- **Repository:** [Detective Conan Card Game](https://github.com/ChuongQuoc1413017/Detective_Conan_Card_Game)

---

<p align="center">
  <b>Enjoy learning and solving cases with the Detective Conan Card Game!</b>
  <br>
  <i>Elementary, my dear detective.</i> 🔎
</p>
