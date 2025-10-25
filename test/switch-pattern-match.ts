// Switch pattern matching with ADT enums
enum Color {
  Red;
  Green;
  Blue;
  Rgb(r: number, g: number, b: number);
}

class Main {
  static main() {
    const color = Main.getColor();
    
    switch (color) {
      case Red:
        console.log("Color was red");
        break;
      case Green:
        console.log("Color was green");
        break;
      case Blue:
        console.log("Color was blue");
        break;
      case Rgb(r, g, b):
        console.log("Color had a red value of " + r);
        console.log("Green: " + g + ", Blue: " + b);
        break;
    }
  }

  static getColor(): Color {
    return Color.Rgb(255, 0, 255);
  }
}

Main.main();