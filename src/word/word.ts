export class Word {
  displayText: string;
  inputText: string;

  constructor(displayText: string, inputText: string) {
    this.displayText = displayText;
    this.inputText = inputText;
  }

  validate(): boolean {
    return /[ぁ-んーa-z0-9!?,.[\]]+/.test(this.inputText);
  }
}
