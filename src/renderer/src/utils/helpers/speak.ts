import type { EventHandler, speakModel } from '@renderer/model/speak';

/**
 * @param text 语音文字
 * @param speechRate – 语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
 * @param lang – 使用的语言，字符串， 例如："zh-cn"
 * @param volume  声音的音量，区间范围是0到1，默认是1。
 * @param pitch – 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1。
 */
export function speak({ text, speechRate, lang, volume, pitch }: speakModel, endEvent?: EventHandler | undefined, startEvent?: EventHandler) {
  if (!window.SpeechSynthesisUtterance) {
    console.warn('当前浏览器不支持文字转语音服务');
    return;
  }

  if (!text) {
    return;
  }
  const speechUtterance = new SpeechSynthesisUtterance();
  speechUtterance.text = text;
  speechUtterance.rate = speechRate || 1;
  speechUtterance.lang = lang || 'zh-CN';
  speechUtterance.volume = volume || 1;
  speechUtterance.pitch = pitch || 1;
  speechUtterance.onend = function () {
    endEvent && endEvent();
  };
  speechUtterance.onstart = function () {
    startEvent && startEvent();
  };
  speechSynthesis.speak(speechUtterance);

  return speechUtterance;
}
