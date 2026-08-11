import { BaseRepository } from './base/BaseRepository';

export interface AssessmentResponsePayload {
  questionId: string;
  selectedValue: number;
}

export interface AssessmentSubmitRequest {
  assessmentKey: string;
  responses: AssessmentResponsePayload[];
}

export interface AssessmentSubmitResponse {
  success: boolean;
  message?: string;
  result?: {
    id: string;
    score: number;
    severity: string;
    interpretation: string;
    recommendation?: string;
    hasCrisisRisk?: boolean;
  };
}

export interface AssessmentAttemptHistory {
  id: string;
  assessmentKey: string;
  score: number;
  severity: string;
  interpretation: string;
  status: string;
  createdAt: string;
}

export class AssessmentRepository extends BaseRepository {
  async submitAssessment(
    payload: AssessmentSubmitRequest,
  ): Promise<AssessmentSubmitResponse> {
    const { data } = await this.http.post<AssessmentSubmitResponse>(
      '/api/patient/assessments/submit',
      payload,
    );
    return data;
  }

  async getHistory(): Promise<{ attempts: AssessmentAttemptHistory[] }> {
    const { data } = await this.http.get<{ attempts: AssessmentAttemptHistory[] }>(
      '/api/patient/assessments',
    );
    return data;
  }
}

export const assessmentRepository = new AssessmentRepository();
