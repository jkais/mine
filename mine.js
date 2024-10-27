class Cell {
  constructor() {
    this.bomb = false;
    this.revealed = false;
    this.bombs_around = 0;
  }
}

class Mine {
  constructor() {
    this.size = [9, 9];
    this.bombs = 10;
    this.playing = false;
    this.alive = true;

    this.click = this.click.bind(this)
  }

  init() {
    this.app = document.body;
    this.drawUI();
    this.startNewGame();
  }

  drawUI() {
    this.app.textContent = "";

    let message = document.createElement("div");
    message.id = "message";

    let grid = document.createElement("div")
    grid.id = "grid";
    grid.style = `grid-template-columns: repeat(${this.size[1]}, 1fr)`;

    for (let y = 0; y < this.size[0]; y++) {
      for (let x = 0; x < this.size[1]; x++) {
        let cell = document.createElement("div");
        cell.addEventListener("click", () => this.click(x, y))
        cell.id = this.id(x, y);
        grid.appendChild(cell);
      }
    }

    let button = document.createElement("button");
    button.innerHTML = "Neues Spiel starten"
    button.addEventListener("click", () => {
      this.startNewGame();
    })

    this.app.append(message);
    this.app.append(grid);
    this.app.append(button);
  }

  startNewGame() {
    this.alive = true;
    this.playing = true;
    this.generateMinefield();
    this.redrawUi();
  }

  generateMinefield() {
    this.field = []
    for (let y = 0; y < this.size[1]; y++) {
      let row = []
      for (let x = 0; x < this.size[0]; x++) {
        row.push(new Cell())
      }
      this.field.push(row)
    }

    let i = this.bombs
    while (i > 0) {

      let x = Math.floor(Math.random() * this.size[0]);
      let y = Math.floor(Math.random() * this.size[1]);

      // TODO: Check if field already has a bomb
      this.field[x][y].bomb = true;
      i--;
    }

    for (let y = 0; y < this.size[1]; y++) {
      for (let x = 0; x < this.size[0]; x++) {
        let bombs_around = 0;
        for (let dy = y - 1; dy <= y + 1; dy++) {
          for (let dx = x - 1; dx <= x + 1; dx++) {
            if (dy >= 0 && dy < this.size[1] && dx >= 0 && dx < this.size[0]) {
              if (this.cellAt([dx, dy]).bomb) bombs_around += 1;
            }
          }
        }
        this.cellAt([x, y]).bombs_around = bombs_around;
      }
    }
  }

  click(x, y) {
    if (this.playing) {
      this.revealField(x, y);
      this.redrawUi();
      this.checkState();
    }
  }

  revealField(x, y) {
    let cell = this.cellAt([parseInt(x), parseInt(y)]);
    if (!cell.revealed) {
      cell.revealed = true;
      if (cell.bombs_around == 0) {
        if (y - 1 >= 0) this.revealField(x, y - 1);
        if (y + 1 < this.size[1]) this.revealField(x, y + 1);
        if (x - 1 >= 0) this.revealField(x - 1, y);
        if (x + 1 < this.size[0]) this.revealField(x + 1, y);
      }
    }
  }

  checkState() {
    if (this.exploded()) {
      this.alive = false;
      this.playing = false;
    };

    if (this.won()) {
      this.playing = false;
    }
  }

  exploded() {
    return this.field.flat().filter((cell) => cell.bomb && cell.revealed).length > 0;
  }

  won() {
    const flat = this.field.flat();
    const all = flat.length;
    const revealed = flat.filter((cell) => cell.revealed && !cell.bomb).length;
    return all - this.bombs == revealed;
  }

  redrawUi() {
    document.querySelectorAll("#grid>*").forEach((e) => {
      e.style = "";
      e.textContent = "";
      e.classList.remove(...e.classList);
    });
    for (const row_index in this.field) {
      for (const cell_index in this.field[row_index]) {
        let element = this.elementAt([row_index, cell_index]);

        const cell = this.field[row_index][cell_index];
        if (cell.revealed) {
          element.classList.add("revealed");
          if (cell.bomb) {
            element.classList.add("bomb");
          } else {
            element.classList.add(`bombs-around-${cell.bombs_around}`)
          }
        }
      }
    }

    let message = "Spiel läuft.";
    if (this.won()) {
      message = "Du hast gewonnen.";
    }

    if (this.exploded()) {
      message = "Du hast verloren.";
    }
    let messageDiv = document.getElementById("message");
    messageDiv.textContent = message;

  }

  elementAt(point) {
    return document.querySelector(`#${this.id(point[1], point[0])}`)
  }

  cellAt(point) {
    return this.field[point[1]][point[0]]
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Mine().init();