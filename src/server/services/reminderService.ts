import { ReminderCategory } from '@/types/Enums';
import http from '../http';
import { RejectReminderRequest, ReminderRuleRequest, SendReminderSmsRequest } from '@/types/Reminder';
import { IUpdateTemplateRequest } from '@/types/SMSTemplateTypes';


const getReminderCategoryList = async () => {
    const { data } = await http.get('/finance/api/reminder/get-notification-category-list');
    return data
}

const getReminderCategoryDetail = async (category: ReminderCategory) => {
    const { data } = await http.get(`/finance/api/reminder/get-notification-category-detail?reminderCategory=${category}`);
    return data
}

const rejectReminder = async (request: RejectReminderRequest) => {
    const { data } = await http.put(`/finance/api/reminder/reject-reminder`, request);
    return data;
}

const sendReminderSms = async (request: SendReminderSmsRequest) => {
    const { data } = await http.post(`/finance/api/reminder/send-reminder-sms`, request);
    return data;
}

const updateTemplate = async (req: IUpdateTemplateRequest) => {
    const { data } = await http.put(`/finance/api/reminder/update-template`, req);
    return data;
}

const getTemplateView = async (req: SendReminderSmsRequest) => {
    const { data } = await http.post(`/finance/api/reminder/template-view`, req);
    return data;
}

const getSMSTemplateList = async () => {
    const { data } = await http.get('/finance/api/reminder/get-template-list');
    return data
}

const updateReminderRule = async (req: ReminderRuleRequest) => {
    const { data } = await http.put('/finance/api/reminder/update-reminder-rule', req);
    return data
}

export {
    getReminderCategoryDetail,
    getReminderCategoryList,
    rejectReminder,
    sendReminderSms,
    updateTemplate,
    getTemplateView,
    getSMSTemplateList,
    updateReminderRule
}

