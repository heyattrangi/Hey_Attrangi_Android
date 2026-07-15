import { WellnessModule } from '../data/models';
import { BaseRepository } from './base/BaseRepository';

export class WellnessRepository extends BaseRepository {
  async listModules(): Promise<WellnessModule[]> {
    const { data } = await this.http.get<{ items: WellnessModule[] }>(
      '/wellness/modules',
    );
    return data.items ?? [];
  }
}

export const wellnessRepository = new WellnessRepository();
