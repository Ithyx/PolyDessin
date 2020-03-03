import { Component, Input } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';

const RGB_MAX_VALUE = 255;
const ACCEPTED_LETTERS = new Set(['a', 'b', 'c', 'd', 'e', 'f']);

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss']
})

export class ColorInputComponent {
  @Input() colorManager: ColorManagerService;

  RED_INDEX: number;
  GREEN_INDEX: number;
  BLUE_INDEX: number;

  constructor(public shortcuts: ShortcutsManagerService
              ) {
                this.RED_INDEX = 0;
                this.GREEN_INDEX = 1;
                this.BLUE_INDEX = 2;
              }

  editRGB(event: Event, index: number): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    let value = parseInt(eventCast.value, 16);

    if (isNaN(value)) {
      value = 0;
    }

    // Vérification qu'on essaie d'accéder à un index possible
    if (index <= this.colorManager.RGB.length) {
      this.colorManager.RGB[index] = Math.min(value, RGB_MAX_VALUE);
      this.colorManager.editRGB();
    }
  }

  checkInput(keybord: KeyboardEvent): boolean {
    const result = keybord.key.toLowerCase();

    const isAnAcceptedNumber = result >= '0' && result <= '9';
    const isAnAcceptedLetter = ACCEPTED_LETTERS.has(result);

    return (isAnAcceptedNumber || isAnAcceptedLetter || (result === 'backspace'));
  }

  disableShortcuts(): void {
    this.shortcuts.focusOnInput = true;
  }

  enableShortcuts(): void {
    this.shortcuts.focusOnInput = false;
  }
}