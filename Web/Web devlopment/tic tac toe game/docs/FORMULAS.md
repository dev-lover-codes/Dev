# 📐 TIC-TAC-TOE MATHEMATICAL FORMULAS

All formulas are provided in **single-line format** enclosed in `$$ ... $$` for easy copy-pasting.

---

## 1. Minimax Algorithm (Core AI Logic)

### Complete Minimax Value Function
$$ V(s, p) = \begin{cases} +10 & \text{if } \exists c \in C : \forall i \in c, \text{board}[i] = \text{AI} \\ -10 & \text{if } \exists c \in C : \forall i \in c, \text{board}[i] = \text{player} \\ 0 & \text{if } \forall i \in \{0,1,...,8\}, \text{board}[i] \neq \text{empty} \land \neg \text{win}(\text{AI}) \land \neg \text{win}(\text{player}) \\ \max_{m \in M(s)} V(\text{apply}(s, m, \text{AI}), \text{player}) & \text{if } p = \text{AI} \\ \min_{m \in M(s)} V(\text{apply}(s, m, \text{player}), \text{AI}) & \text{if } p = \text{player} \end{cases} \text{ where } C = \{\{0,1,2\}, \{3,4,5\}, \{6,7,8\}, \{0,3,6\}, \{1,4,7\}, \{2,5,8\}, \{0,4,8\}, \{2,4,6\}\}, M(s) = \{i : \text{board}[i] = \text{empty}\}, s = \text{game state}, p = \text{current player} $$

---

## 2. Win Detection Formula

### General Win Condition
$$ \text{Win}(b, p) = \bigvee_{c \in C} \left( \bigwedge_{i \in c} b[i] = p \right) \text{ where } b = \text{board array}, p = \text{player symbol}, C = \{\{0,1,2\}, \{3,4,5\}, \{6,7,8\}, \{0,3,6\}, \{1,4,7\}, \{2,5,8\}, \{0,4,8\}, \{2,4,6\}\} $$

---

## 3. Star Rating System

### Star Calculation Based on Moves
$$ \text{Stars}(m) = \begin{cases} 3 & \text{if } m \leq 3 \\ 2 & \text{if } m = 4 \\ 1 & \text{if } m = 5 \\ 0 & \text{if } m \geq 6 \end{cases} \text{ where } m = \text{number of player moves to win} $$

---

## 4. Game State Evaluation

### Complete State Value
$$ E(s) = \sum_{c \in C} \left( w_c \cdot \left( \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{AI}] - \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{player}] \right) \right) \text{ where } w_c = \begin{cases} 100 & \text{if } \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{AI}] = 3 \\ -100 & \text{if } \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{player}] = 3 \\ 10 & \text{if } \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{AI}] = 2 \land \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{player}] = 0 \\ -10 & \text{if } \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{player}] = 2 \land \sum_{i \in c} \mathbb{1}[\text{board}[i] = \text{AI}] = 0 \\ 1 & \text{otherwise} \end{cases}, \mathbb{1}[\cdot] = \text{indicator function}, s = \text{game state}, C = \text{winning combinations} $$

---

## 5. Optimal Move Selection

### Best Move Formula
$$ m^* = \arg\max_{m \in M(s)} \left( \min_{m' \in M(s')} V(s'', \text{player}) \right) \text{ where } m^* = \text{optimal move}, M(s) = \{i : \text{board}[i] = \text{empty}\}, s' = \text{apply}(s, m, \text{AI}), s'' = \text{apply}(s', m', \text{player}), V = \text{minimax value function} $$

---

## 6. Draw Detection

### Draw Condition
$$ \text{Draw}(b) = \left( \forall i \in \{0,1,2,3,4,5,6,7,8\}, b[i] \neq \text{empty} \right) \land \neg \text{Win}(b, \text{AI}) \land \neg \text{Win}(b, \text{player}) \text{ where } b = \text{board state} $$

---

## 7. Stage Progression Formula

### Next Stage Unlock Condition
$$ \text{Unlock}(l, s) = \begin{cases} s + 1 & \text{if } \text{Win}(l, s) \land s < 15 \\ \text{null} & \text{if } s = 15 \\ s & \text{if } \neg \text{Win}(l, s) \end{cases} \text{ where } l = \text{level} \in \{1, 2, 3\}, s = \text{current stage} \in \{1, 2, ..., 15\}, \text{Win}(l, s) = \text{player won stage } s \text{ of level } l $$

---

## 8. Level Unlock Condition

### Level Progression
$$ \text{UnlockLevel}(l) = \begin{cases} \text{true} & \text{if } l = 1 \\ \text{true} & \text{if } l = 2 \land \forall s \in \{1,...,15\}, \text{Stars}(1, s) > 0 \\ \text{true} & \text{if } l = 3 \land \forall s \in \{1,...,15\}, \text{Stars}(2, s) > 0 \\ \text{false} & \text{otherwise} \end{cases} \text{ where } l = \text{level}, \text{Stars}(l, s) = \text{stars earned in level } l \text{ stage } s $$

---

## 9. AI Difficulty Selection

### Move Selection by Level
$$ \text{AIMove}(l, s, b) = \begin{cases} \text{Random}(M(b)) & \text{if } l = 1 \\ \text{Smart}(b) & \text{if } l = 2 \\ \text{Minimax}(b) & \text{if } l = 3 \land s < 15 \\ \text{MinimaxFirst}(b) & \text{if } l = 3 \land s = 15 \end{cases} \text{ where } l = \text{level}, s = \text{stage}, b = \text{board}, M(b) = \{i : b[i] = \text{empty}\}, \text{Smart}(b) = \begin{cases} \text{WinMove}(b, \text{AI}) & \text{if exists} \\ \text{BlockMove}(b, \text{player}) & \text{if exists} \\ \text{Random}(M(b)) & \text{otherwise} \end{cases}, \text{MinimaxFirst} = \text{AI moves first with minimax} $$

---

## 10. Online Game State Synchronization

### Real-time Update Detection
$$ \text{Sync}(g_{\text{local}}, g_{\text{remote}}) = \begin{cases} g_{\text{remote}} & \text{if } t_{\text{remote}} > t_{\text{local}} \\ g_{\text{local}} & \text{otherwise} \end{cases} \text{ where } g = \text{game state} = \{b, p, s\}, b = \text{board}, p = \text{current player}, s = \text{status}, t = \text{lastUpdate timestamp}, \text{polling interval} = 500\text{ms} $$

---

## 11. Turn Validation (Online Mode)

### Valid Move Check
$$ \text{ValidMove}(i, r, t, b) = \begin{cases} \text{true} & \text{if } b[i] = \text{empty} \land r = t \land i \in \{0,1,...,8\} \\ \text{false} & \text{otherwise} \end{cases} \text{ where } i = \text{cell index}, r = \text{player role} \in \{\text{X}, \text{O}\}, t = \text{current turn} \in \{\text{X}, \text{O}\}, b = \text{board state} $$

---

## 12. Game Completion Percentage

### Progress Calculation
$$ P(l) = \frac{\sum_{s=1}^{15} \mathbb{1}[\text{Stars}(l, s) > 0]}{15} \times 100\% \text{ where } P(l) = \text{completion percentage for level } l, \mathbb{1}[\cdot] = \text{indicator function} $$

---

## 13. Total Score Calculation

### Aggregate Stars
$$ S_{\text{total}} = \sum_{l=1}^{3} \sum_{s=1}^{15} \text{Stars}(l, s) \text{ where } S_{\text{total}} = \text{total stars earned}, \text{max possible} = 3 \times 3 \times 15 = 135 \text{ stars} $$

---

## 14. Winning Probability (Level 3, Stage 15)

### Theoretical Win Chance
$$ P(\text{player wins} | l=3, s=15, \text{AI first}) = 0 \text{ where perfect minimax AI ensures } P(\text{draw}) + P(\text{AI wins}) = 1, P(\text{draw}) \approx 1 \text{ if player plays optimally} $$

---

## 15. Matrix Representation of Board State

### Board as 3×3 Matrix
$$ B = \begin{bmatrix} b_0 & b_1 & b_2 \\ b_3 & b_4 & b_5 \\ b_6 & b_7 & b_8 \end{bmatrix} \text{ where } b_i \in \{\text{empty}, \text{X}, \text{O}\}, \text{Win conditions} = \{\text{row}(i) : \forall j \in \{0,1,2\}, B_{i,j} = p\} \cup \{\text{col}(j) : \forall i \in \{0,1,2\}, B_{i,j} = p\} \cup \{\text{diag}_1 : \forall i \in \{0,1,2\}, B_{i,i} = p\} \cup \{\text{diag}_2 : \forall i \in \{0,1,2\}, B_{i,2-i} = p\}, p = \text{player symbol} $$

---

**All formulas are ready for copy-paste into LaTeX, Markdown, or mathematical documents!** 📊
