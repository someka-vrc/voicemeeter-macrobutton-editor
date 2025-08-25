
import { defaultMacroButton, defaultMB_MIDI, defaultMB_TRIGGER, defaultMB_XINPUT, defaultMB_GPIO, defaultVBHIDMapItem } from "../defaults";
import { MacroButtonConfiguration, MacroButtonConfigMeta } from "../types/macroButton";
import { v4 as uuidv4 } from "uuid";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export function generateXmlFromItems(items: MacroButtonConfiguration[], configMeta: MacroButtonConfigMeta): string {
  // indexのみ再採番し、idフィールドは除外
  const macroButtons = items.map((item, idx) => {
    const { id, ...rest } = item;
    return { ...rest, "@_index": idx + 1 };
  });
  const obj = {
    VBAudioVoicemeeterMacroButtonMap: {
      MacroButtonConfiguration: {
        ...configMeta,
        MacroButton: macroButtons,
      },
    },
  };
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
    suppressEmptyNode: true,
    processEntities: false,
    suppressBooleanAttributes: false,
    suppressUnpairedNode: false,
    preserveOrder: false,
  });
  return '<?xml version="1.0" encoding="utf-8"?>\n' + builder.build(obj);
}


export function parseMacroButtons(xml: string): MacroButtonConfiguration[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xml);
  const buttons =
    parsed?.VBAudioVoicemeeterMacroButtonMap?.MacroButtonConfiguration
      ?.MacroButton;
  if (!buttons) return [];
  const arr = Array.isArray(buttons) ? buttons : [buttons];
  return arr
    .map(
      (btn: any): MacroButtonConfiguration => ({
        ...defaultMacroButton,
        ...btn,
        id: uuidv4(), // 新規にuuidを発行
        "@_index": Number(btn["@_index"] ?? btn.index),
        MB_MIDI: { ...defaultMB_MIDI, ...(btn.MB_MIDI ?? {}) },
        MB_TRIGGER: { ...defaultMB_TRIGGER, ...(btn.MB_TRIGGER ?? {}) },
        MB_XINPUT: { ...defaultMB_XINPUT, ...(btn.MB_XINPUT ?? {}) },
        MB_GPIO: { ...defaultMB_GPIO, ...(btn.MB_GPIO ?? {}) },
        VBHIDMapItem: { ...defaultVBHIDMapItem, ...(btn.VBHIDMapItem ?? {}) },
      })
    )
    .sort((a, b) => a["@_index"] - b["@_index"]);
}
