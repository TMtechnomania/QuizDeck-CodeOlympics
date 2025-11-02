# QuizDeck-CodeOlympics
https://codeolympics.com/

# QuizDeck

A sleek, API-driven quiz app built for the **CodeOlympics** hackathon. It uses pure HTML, CSS, and JavaScript, focusing on high performance, reliability, and a clever UI flow to mask API latency.

---

## 🚀 About The Project

This isn't just a static quiz app. It's an exercise in constraint-driven development. The app provides a full user flow:

1.  It greets the user and saves their **name** to Local Storage.
2.  Lets them choose a **game mode** (Normal or Rapid-Fire).
3.  Lets them select a **quiz category**.
4.  Pulls live questions from an API, masking the delay with a "Fun Fact" loading screen.
5.  Runs the timed quiz, complete with hints in Normal Mode.
6.  Saves and displays high scores, ranked by both score and time.

### Features

* **Dynamic User Flow:** Greets the user by name, then guides them through mode and category selection.
* **Two Game Modes:**
    * **Normal Mode:** 10 questions, 30-second timer per question, and a one-time **50/50 Hint**.
    * **Rapid-Fire Mode:** 5 questions, 12-second timer per question, no hints.
* **Dynamic Content via APIs:**
    * **Questions:** Fetched live from the **Open Trivia Database**.
    * **Facts:** Pre-loads a programming quote from **Quotable.io** to use as a smart loading screen.
* **Advanced High Score System:**
    * Saves scores to Local Storage *per category* and *per mode*.
    * Ranking is based on **highest score** first, then **lowest total time** to break ties.
* **Pure Vanilla JS:** Zero installable dependencies, built with 100% pure HTML, CSS, and ES6+ JavaScript.

---

## 🛠️ Tech Stack

* **HTML5**
* **CSS3** (Includes CSS Variables, Flexbox, and Transitions)
* **Vanilla JavaScript (ES6+)** (Includes `async/await`, `fetch`, and Local Storage)
* **APIs Used:**
    * **Open Trivia Database** (`opentdb.com`) for quiz questions.
    * **Quotable** (`api.quotable.io`) for the fun fact/quote.

---

## 🏆 Hackathon Constraints

This project was built as a solo entry and successfully adheres to the following rules:

* **Functional Software:** All features work reliably with no broken parts or undefined behavior.
* **Constraint Compliance:**
    * **Line Limit:** The entire codebase (HTML, CSS, JS) is well under the 500-line limit.
    * **Performance:** All user actions (clicks, animations) are instant. The primary API delay (fetching questions) is cleverly masked by the "Fun Fact" loading screen. This ensures the user *perceives* no delay and the app remains responsive.
    * **No Frameworks:** 100% free of any external UI libraries or frameworks (like React, Vue, etc.).
* **Error Handling:** Includes robust logic for API fetch fallbacks and graceful handling of user input.

### Performance & API Delay Handling

The biggest challenge was the "under 2s" action constraint with a live API. We solved this by:
1.  Pre-loading the "Fun Fact" API on page load.
2.  When a user selects a category, we **run the question API call and a 3-second timer in parallel.**
3.  The user is shown the Fun Fact and must wait for the 3-second timer to finish, after which a "Next" button appears.
4.  This 3-second *minimum* delay, combined with the user's own read time, provides a critical buffer. By the time the user clicks "Next," the question API has almost certainly finished, allowing the quiz to start instantly.

---

## 🏁 Getting Started

No build steps or installations required.

1.  Clone the repository:
    ```sh
    git clone [https://github.com/TMtechnomania/QuizDeck-CodeOlympics.git](https://github.com/TMtechnomania/QuizDeck-CodeOlympics.git)
    ```
2.  Open the `index.html` file in your favorite browser. (An internet connection is required for the APIs to function).

---

## 👤 Author

* **Team:** `buildwithKT.dev`
* **Name:** Kartikey Tiwari
* **Discord:** `tiwarikartik3002`
* **Email:** `tiwari.kartik3002@gmail.com`