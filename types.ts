export interface GeneratedSticker {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface StickerGenerationParams {
  base64Image: string;
  prompt: string;
  subjectDescription?: string;
}