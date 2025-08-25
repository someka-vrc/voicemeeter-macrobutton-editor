import {
  defaultMacroButton,
  defaultMB_MIDI,
  defaultMB_TRIGGER,
  defaultMB_XINPUT,
  defaultMB_GPIO,
  defaultVBHIDMapItem,
} from "../defaults";
import {
  MacroButton,
  MacroButtonElement,
  VBAudioVoicemeeterMacroButtonMap,
} from "../types/macroButtonXml";
import { v4 as uuidv4 } from "uuid";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export function generateXmlFromItems(
  items: MacroButtonElement[],
  root: VBAudioVoicemeeterMacroButtonMap
): string {
  root.MacroButtonConfiguration.MacroButton = items.map((item) => {
    const { ctrl, ...rest } = item;
    return { ...rest } as MacroButton;
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
    suppressEmptyNode: false,
    processEntities: false,
    suppressBooleanAttributes: false,
    suppressUnpairedNode: false,
    preserveOrder: false,
  });
  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    builder.build({ VBAudioVoicemeeterMacroButtonMap:root })
  );
}

export function parseMacroButtons(xml: string): {root:VBAudioVoicemeeterMacroButtonMap,elements:MacroButtonElement[]} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xml);
  const xmlRoot =
    parsed?.VBAudioVoicemeeterMacroButtonMap as VBAudioVoicemeeterMacroButtonMap;
  if (!xmlRoot) throw new Error("Invalid XML structure");
  const buttons = xmlRoot.MacroButtonConfiguration.MacroButton;
  if (!buttons) throw new Error("Invalid XML structure");
  const arr = Array.isArray(buttons) ? buttons : [buttons];
  const elems = arr
    .map(
      (btn: any): MacroButtonElement =>
        ({
          ...defaultMacroButton,
          ...btn,
          ctrl: { id: uuidv4() }, // ctrlプロパティとしてuuidを発行
          "@_index": Number(btn["@_index"] ?? btn.index),
          MB_MIDI: { ...defaultMB_MIDI, ...(btn.MB_MIDI ?? {}) },
          MB_TRIGGER: { ...defaultMB_TRIGGER, ...(btn.MB_TRIGGER ?? {}) },
          MB_XINPUT: { ...defaultMB_XINPUT, ...(btn.MB_XINPUT ?? {}) },
          MB_GPIO: { ...defaultMB_GPIO, ...(btn.MB_GPIO ?? {}) },
          VBHIDMapItem: { ...defaultVBHIDMapItem, ...(btn.VBHIDMapItem ?? {}) },
        })
    )
    .sort((a, b) => a["@_index"] - b["@_index"]);

  return { root: xmlRoot, elements: elems };
}
