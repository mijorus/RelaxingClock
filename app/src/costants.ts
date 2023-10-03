// import { isMacintosh } from "./utils/utils";

export const isMacintosh = navigator.userAgent.indexOf('Mac OS X');
export const altLabel = isMacintosh ? '⌥' : 'Alt';
export const surveyUrl = 'https://forms.gle/o2CV4tL7R29Np1bk6';