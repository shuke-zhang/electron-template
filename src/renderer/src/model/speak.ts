export interface speakModel {
  text: string;
  speechRate?: number;
  lang?: string;
  volume?: number;
  pitch?: number;
}
export type EventHandler = () => void;
