import { ReminderCategory } from "./Enums";

export interface IUpdateTemplateRequest{
    template : string ,
    reminderCategory : ReminderCategory
}