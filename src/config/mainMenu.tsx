import React from "react";
import {
    Add,
    Assignment,
    Dashboard,
    MonetizationOn,
    People,
    Settings,
    StorageSharp,
    VerifiedUser

} from "@mui/icons-material";
import { MenuResponse } from "@/types/PermissionTypes";



const icons = {
    Dashboard: <Dashboard fontSize="small" />,
    AddNewInsurance: <Add fontSize="small" />,
    InsuranceManagement: <Assignment fontSize="small" />,
    PeopleManagement: <People fontSize="small" />,
    ReceiptAndPayment: <MonetizationOn fontSize="small" />,
    Settings: <Settings fontSize="small" />,
    UserManagement: <VerifiedUser fontSize="small" />,
    BaseInformation: <StorageSharp />
};

const mainListItems: MenuResponse[] = [
    {
        id: 1,
        name: 'داشبورد',
        //icon: <DashboardIcon />,
        path: '/',
        parentId: null,
        onlyRoute: true,
    },
    {
        id: 2,
        name: 'ثبت بیمه‌ نامه جدید',
        //icon: <Add />,
        path: '/insurance-policy/create',
        parentId: null,
        onlyRoute: true
    },
    {
        id: 3,
        name: 'مدیریت بیمه نامه ها',
        //icon: <AssignmentIcon />,
        path: '',
        parentId: null,
        onlyRoute: true,
        children: [
            {
                id: 4,
                name: 'بایگانی کل',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/insurance-policy',
                parentId: 3,
                onlyRoute: true,
                children: [
                    {
                        id: 341,
                        path: '/policy-installment-detail',
                        name: "اقساط",
                        parentId: 4,
                        onlyRoute: false
                    }
                ]
            },
            {
                id: 5,
                name: 'ثبت الحاقیه',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/addendum',
                parentId: 3,
                onlyRoute: true
            },
            {
                id: 63,
                name: 'لیست الحاقیه ها',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/addendum-list',
                parentId: 3,
                onlyRoute: true
            },
        ]
    },
    {
        id: 6,
        name: 'مدیریت اشخاص',
        //icon: <PeopleIcon />,
        path: '',
        parentId: null,
        onlyRoute: true,
        children: [
            {
                id: 7,
                name: 'اشخاص',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/people',
                onlyRoute: true,
                parentId: 6
            },
            {
                id: 8,
                name: 'مدیریت بازاریاب',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/marketer',
                onlyRoute: true,
                parentId: 6
            },
            {
                id: 69,
                name: 'کاربران',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/users',
                onlyRoute: true,
                parentId: 6
            },
            {
                id: 79,
                name: 'دسترسی',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/permissions',
                onlyRoute: true,
                parentId: 6
            },
        ]
    },
    {
        id: 9,
        name: 'دریافت و پرداخت',
        //icon: <MonetizationOnIcon />,
        path: '',
        onlyRoute: true,
        parentId: null,
        children: [
            {
                id: 10,
                name: 'دریافت و پرداخت',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/finance-installments',
                onlyRoute: true,
                parentId: 9
            },
            {
                id: 11,
                name: 'تراکنش های کیف پول',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/wallet-transaction',
                onlyRoute: true,
                parentId: 9
            },
            {
                id: 12,
                name: 'گزارشات مالی',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/general-report',
                onlyRoute: true,
                parentId: 9
            }
        ]
    },
    {
        id: 13,
        name: 'تنظیمات',
        //icon: <SettingsIcon />,
        path: '',
        parentId: null,
        onlyRoute: true,
        children: [
            {
                id: 14,
                name: 'مدیریت فایل',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/attachment-types',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 15,
                name: 'تعریف حساب بانکی',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/bank-account',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 16,
                name: 'کارمزد بیمه‌ها',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/insurance-fee',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 17,
                name: 'ساخت فرم بیمه ای',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/insurance-policy/form',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 18,
                name: 'وسایل نقلیه',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/vehicle',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 19,
                name: 'شرکت‌های بیمه‌ای',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/insurance-company',
                onlyRoute: true,
                parentId: 13
            },
            {
                id: 131,
                name: 'تنظیمات یادآوری',
                //icon: <Circle sx={{ fontSize: '0.7rem' }} />,
                path: '/reminder-setting',
                onlyRoute: true,
                parentId: 13
            },
        ]
    }
];




export {
    mainListItems,
    icons
}