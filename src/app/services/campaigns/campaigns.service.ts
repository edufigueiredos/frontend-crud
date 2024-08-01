import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Campaign, CampaignFilter, CampaignParams} from "../../models/campaigns/campaign";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  public getCampaigns(getParams?: CampaignParams): Observable<Array<Campaign>> {
    let params = new HttpParams();

    if (getParams?.filter?.title) {
      params = params.set('title_like', getParams?.filter?.title);
    }

    if (getParams?.filter?.startDate) {
      params = params.set('createdAt_gte', getParams?.filter?.startDate.toISOString());
    }

    if (getParams?.filter?.endDate) {
      params = params.set('createdAt_lte', getParams?.filter?.endDate.toISOString());
    }

    if (getParams?.sort) {
      params = params.set('_sort', getParams?.sort?.key)
      params = params.set('_order', getParams?.sort?.sort);
    }

    return this._http.get<Array<Campaign>>(`${this._baseUrl}/campaigns`, {params});
  }

  public deleteCampaign(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/campaigns/${id}`);
  }
}
