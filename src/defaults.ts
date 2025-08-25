
import { v4 as uuidv4 } from 'uuid';
import { MacroButton, MB_MIDI, MB_TRIGGER, MB_XINPUT, MB_GPIO, VBHIDMapItem } from "./types/macroButton";

export const defaultMB_MIDI: MB_MIDI = { "@_b1": "00", "@_b2": "00", "@_b3": "00", "@_b4": "00", "@_b5": "00", "@_b6": "00" };
export const defaultMB_TRIGGER: MB_TRIGGER = { "@_tchannel": "0", "@_tin": "-20.0", "@_tout": "-20.0", "@_tmsHold": "1000", "@_tafterMute": "0" };
export const defaultMB_XINPUT: MB_XINPUT = { "@_nctrl": "0", "@_nbutton": "0" };
export const defaultMB_GPIO: MB_GPIO = { "@_ninput": "0" };
export const defaultVBHIDMapItem: VBHIDMapItem = { "@_name": '', "@_id": '', "@_device": '', "@_vendor": '', "@_product": '', "@_version": '', "@_uspa": '', "@_us": '', "@_nbb": '', "@_code1": '', "@_code2": '', "@_code3": '', "@_type": '', "@_mode": '' };


export const defaultMacroButton: MacroButton = {
  id: uuidv4(),
  "@_index": 0,
  "@_type": "0",
  "@_color": "0",
  "@_key": "0",
  "@_ctrl": "0",
  "@_shift": "0",
  "@_alt": "0",
  "@_anyway": "0",
  "@_exclusive": "0",
  "@_trigger": "0",
  "@_xinput": "0",
  MB_MIDI: defaultMB_MIDI,
  MB_TRIGGER: defaultMB_TRIGGER,
  MB_XINPUT: defaultMB_XINPUT,
  MB_GPIO: defaultMB_GPIO,
  VBHIDMapItem: defaultVBHIDMapItem,
  MB_Name: '',
  MB_Subname: '',
  MB_InitRequest: '',
  MB_OnRequest: '',
  MB_OffRequest: '',
};
