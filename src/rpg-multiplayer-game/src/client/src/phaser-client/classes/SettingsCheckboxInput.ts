import CheckboxInput from "./CheckboxInput";
import SettingsEventKeys from "../consts/SettingsEventKeys";
import { settingsEvents } from "../events/EventCenter";

export default class SettingsCheckboxInput extends CheckboxInput {
  check(): void {
    super.check();
    settingsEvents.emit(SettingsEventKeys.VALUE_UPDATE, this);
  }

  uncheck(): void {
    super.uncheck();
    settingsEvents.emit(SettingsEventKeys.VALUE_UPDATE, this);
  }
}