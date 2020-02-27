import { Component, Input } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss']
})
export class ColorInputComponent {
  @Input() colorManager: ColorManagerService;

  RED_INDEX = 0;
  GREEN_INDEX = 1;
  BLUE_INDEX = 2;

  readonly ACCEPTED_LETTERS = new Set(['a', 'b', 'c', 'd', 'e', 'f']);

  constructor(public shortcuts: ShortcutsManagerService) {}

  editRGB(event: Event, index: number) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    let value = parseInt(eventCast.value, 16);

    if (isNaN(value)) {
      value = 0;
    }

    // Vérification qu'on essaie d'accéder à un index possible
    if (index <= this.colorManager.RGB.length) {
      this.colorManager.RGB[index] = Math.min(value, 255);
      this.colorManager.editRGB();
    }
  }

  checkInput(clavier: KeyboardEvent): boolean {
    const resultat = clavier.key.toLowerCase();

    const estUnNombreAcceptee = resultat >= '0' && resultat <= '9';
    const estUneLettreAcceptee = this.ACCEPTED_LETTERS.has(resultat);

    return (estUnNombreAcceptee || estUneLettreAcceptee || (resultat === 'backspace'));
  }

  disableShortcuts() {
    this.shortcuts.focusOnInput = true;
  }

  enableShortcuts() {
    this.shortcuts.focusOnInput = false;
  }
}
