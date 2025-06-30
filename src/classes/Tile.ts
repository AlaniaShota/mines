export class Tile {
  public hasMine: boolean = false;
  public revealed: boolean = false;
  private element: HTMLDivElement;

  constructor(
    public row: number,
    public col: number,
    private onClick: (tile: Tile) => void
  ) {
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.addEventListener("click", () => this.handleClick());
  }

  private handleClick() {
    if (!this.revealed) {
      this.onClick(this);
    }
  }

  reveal() {
    this.revealed = true;
    this.element.classList.add("revealed");

    if (this.hasMine) {
      this.element.textContent = "Mine";
      this.element.classList.add("mine");
    } else {
      this.element.textContent = "Diamond";
      this.element.classList.add("diamond");
    }
  }

  setMine() {
    this.hasMine = true;
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  reset() {
    this.revealed = false;
    this.hasMine = false;
    this.element.className = "tile";
    this.element.textContent = "";
  }
}
