/** MacroButtonConfiguration 要素の Meta 情報の型。 "@_" で始まるプロパティは属性を表す */
export type MacroButtonConfigMeta = {
  "@_x0": string;
  "@_y0": string;
  "@_dx": string;
  "@_dy": string;
};

/** MB_MIDI 要素の型。 "@_" で始まるプロパティは属性を表す */
export type MB_MIDI = { "@_b1": string; "@_b2": string; "@_b3": string; "@_b4": string; "@_b5": string; "@_b6": string };
/** MB_TRIGGER 要素の型。 "@_" で始まるプロパティは属性を表す */
export type MB_TRIGGER = { "@_tchannel": string; "@_tin": string; "@_tout": string; "@_tmsHold": string; "@_tafterMute": string };
/** MB_XINPUT 要素の型。 "@_" で始まるプロパティは属性を表す */
export type MB_XINPUT = { "@_nctrl": string; "@_nbutton": string };
/** MB_GPIO 要素の型。 "@_" で始まるプロパティは属性を表す */
export type MB_GPIO = { "@_ninput": string };
/** VBHIDMapItem 要素の型。 "@_" で始まるプロパティは属性を表す */
export type VBHIDMapItem = { "@_name": string; "@_id": string; "@_device": string; "@_vendor": string; "@_product": string; "@_version": string; "@_uspa": string; "@_us": string; "@_nbb": string; "@_code1": string; "@_code2": string; "@_code3": string; "@_type": string; "@_mode": string };

/**
 * XML の MacroButtonConfiguration 要素の型。
 * "@_" で始まるプロパティは属性を表す
 */
export type MacroButtonConfiguration = {
  id: string; // uuid等で発行する固有ID（XMLには出力しない）
  "@_index": number;
  "@_type": string;
  "@_color": string;
  "@_key": string;
  "@_ctrl": string;
  "@_shift": string;
  "@_alt": string;
  "@_anyway": string;
  "@_exclusive": string;
  "@_trigger": string;
  "@_xinput": string;
  MB_MIDI: MB_MIDI;
  MB_TRIGGER: MB_TRIGGER;
  MB_XINPUT: MB_XINPUT;
  MB_GPIO: MB_GPIO;
  VBHIDMapItem: VBHIDMapItem;
  MB_Name: string;
  MB_Subname: string;
  MB_InitRequest: string;
  MB_OnRequest: string;
  MB_OffRequest: string;
};
