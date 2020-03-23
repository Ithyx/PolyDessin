import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { CommandManagerService } from '../command/command-manager.service';
import { PrimaryColorChangeService } from '../command/primary-color-change.service';
import { SecondaryColorChangeService } from '../command/secondary-color-change.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class ColorChangerToolService implements ToolInterface {

  activeElement: DrawElement | undefined;

  constructor(private colorParameter: ColorParameterService,
              private commands: CommandManagerService,
              private sanitizer: DomSanitizer
              ) {}

  onMouseClick(): void {
    if (!this.activeElement) { return; }
    if (this.activeElement.primaryColor !== this.colorParameter.primaryColor) {
      this.commands.execute(new PrimaryColorChangeService(this.activeElement, this.colorParameter, this.sanitizer));
    }
  }

  onRightClick(): void {
    if (!this.activeElement) { return; }
    if (this.activeElement.secondaryColor !== this.colorParameter.secondaryColor) {
      this.commands.execute(new SecondaryColorChangeService(this.activeElement, this.colorParameter, this.sanitizer));
    }
  }
}
