class Cell {
  constructor() {
    this.bomb = false;
    this.revealed = false;
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
  }

  drawUI() {
    this.app.textContent = "";

    let grid = document.createElement("div")
    grid.id = "grid";
    grid.style = `grid-template-columns: repeat(${this.size[1]}, 1fr)`;

    for (let y = 0; y < this.size[0]; y++) {
      for (let x = 0; x < this.size[1]; x++) {
        let cell = document.createElement("div");
        cell.addEventListener("click", () => this.click(x, y))
        cell.classList.add(this.id(x, y));
        grid.appendChild(cell);
      }
    }

    let button = document.createElement("button");
    button.innerHTML = "Neues Spiel starten"
    button.addEventListener("click", () => {
      this.startNewGame();
    })

    this.app.append(grid);
    this.app.appendChild(button);
  }

  click(x, y) {
    if (this.playing) {
      let cell = this.cellAt([parseInt(x), parseInt(y)]);
      cell.revealed = true;
      this.redrawUi();
      this.checkState();
    }
  }

  startNewGame() {
    this.alive = true;
    this.playing = true;
    this.generateMinefield();
    this.redrawUi();
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
    });
    for (const row_index in this.field) {
      for (const cell_index in this.field[row_index]) {
        const cell = this.field[row_index][cell_index];
        if (cell.revealed) {
          this.elementAt([row_index, cell_index]).classList.add("revealed");
          if (cell.bomb) {
            this.elementAt([row_index, cell_index]).classList.add("bomb");
          }
        }
      }
    }
  }

  elementAt(point) {
    return document.querySelector(`.${this.id(point[1], point[0])}`)
  }

  cellAt(point) {
    return this.field[point[1]][point[0]]
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Mine().init();