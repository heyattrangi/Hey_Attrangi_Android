import { mapAiReply } from '../data/mappers';
import { ChatMessage } from '../data/models';
import { BackendAiChatResponse } from '../data/dto';
import { BaseRepository } from './base/BaseRepository';

export class ChatRepository extends BaseRepository {
  async sendMessage(
    message: string,
    modeId: string,
    sessionId: string,
  ): Promise<ChatMessage> {
    const { data } = await this.http.post<BackendAiChatResponse>('/ai/chat', {
      message,
      modeId,
      session_id: sessionId,
    });
    return mapAiReply(data.reply);
  }
}

export const chatRepository = new ChatRepository();
