import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { CommandManagerService } from '../command/command-manager.service';
import { PrimaryColorChangeService } from '../command/primary-color-change.service';
import { SecondaryColorChangeService } from '../command/secondary-color-change.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class ColorChangerToolService implements ToolInterface {

  activeElementID: number;

  constructor(public colorParameter: ColorParameterService,
              public stockageSVG: SVGStockageService,
              public commands: CommandManagerService
              ) {}

  onMouseClick(): void {
    if (this.stockageSVG.getCompleteSVG()[this.activeElementID].primaryColor !== this.colorParameter.getPrimaryColor()) {
      this.commands.execute(new PrimaryColorChangeService(this.activeElementID, this.stockageSVG, this.colorParameter));
    }
  }

  onRightClick(): void {
    if (this.stockageSVG.getCompleteSVG()[this.activeElementID].secondaryColor !== this.colorParameter.getSecondaryColor()) {
      this.commands.execute(new SecondaryColorChangeService(this.activeElementID, this.stockageSVG, this.colorParameter));
    }
  }
}
