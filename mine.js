class Cell {
  constructor() {
    this.mine = false;
    this.revealed = false;
  }
}


class Mine {
  constructor() {
    this.size = [20, 20];
    this.mines = 20;
    this.playing = false;
    this.alive = true;
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

    let i = this.mines
    while (i > 0) {
      let x = Math.floor(Math.random() * this.size[0]);
      let y = Math.floor(Math.random() * this.size[1]);
      this.field[x][y].mine = true;
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
    console.log(x + " " + y)
  }

  startNewGame() {
    this.alive = true;
    this.playing = true;
    this.generateMinefield();
    this.redrawUi();
  }

  redrawUi() {
    document.querySelectorAll("#grid>*").forEach((e) => {
      e.style = "";
      e.classList.remove("block");
    });
    for (const row_index in this.field) {
      for (const cell_index in this.field[row_index]) {
        const cell = this.field[row_index][cell_index];
        if (cell.mine) {
          this.elementAt([row_index, cell_index]).style = "background-color: red;"
        }
      }
    }
  }

  elementAt(point) {
    return document.querySelector(`.${this.id(point[1], point[0])}`)
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Mine().init();