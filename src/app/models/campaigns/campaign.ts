export interface Campaign {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
  imageUrl: string;
}

export interface CampaignFilter {
  title?: string | null,
  startDate?: Date | null,
  endDate?: Date | null
}

export interface CampaignSort {
  key: ColumnName,
  label?: string,
  sort: 'desc' | 'asc',
}

export interface CampaignParams {
  filter?: CampaignFilter;
  sort?: CampaignSort;
}

export type ColumnName = 'title' | 'description' | 'createdAt' | 'imageUrl';
