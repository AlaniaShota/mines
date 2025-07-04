import diamondIcon from "../assets/diamond.svg?raw";
import bombIcon from "../assets/bomb.svg?raw";

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

  // reveal() {
  //   this.revealed = true;
  //   this.element.classList.add("revealed");

  //   this.element.innerHTML = this.hasMine ? bombIcon : diamondIcon;

  //   this.element.querySelector("svg")?.classList.add("icon");

  //   if (this.hasMine) {
  //     this.element.classList.add("mine");
  //   } else {
  //     this.element.classList.add("diamond");
  //   }
  //   const svg = this.element.querySelector("svg");
  //   if (svg) {
  //     svg.classList.add("icon");
  //     svg.style.fill = this.hasMine ? " #000" : "#fff";
  //   }
  // }
  reveal() {
    this.revealed = true;
    this.element.classList.add("revealed");

    const iconHTML = this.hasMine ? bombIcon : diamondIcon;
    this.element.innerHTML = iconHTML;

    const svg = this.element.querySelector("svg");

    if (svg) {
      svg.classList.add("icon");
      svg.style.fill = this.hasMine ? "#000" : "#fff";
    }

    if (this.hasMine) {
      this.element.classList.add("mine");
    } else {
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
