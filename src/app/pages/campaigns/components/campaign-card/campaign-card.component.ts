import {Component, inject, input, output} from '@angular/core';
import {Campaign} from "../../../../models/campaigns/campaign";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {CampaignsService} from "../../../../services/campaigns/campaigns.service";

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss'
})
export class CampaignCardComponent {
  public campaign = input<Campaign>();
  public deleteCampaign = output<string | null>();

  protected deleteCampaignById(): void {
    this.deleteCampaign.emit(this.campaign()?.id ?? null)
  }
}
