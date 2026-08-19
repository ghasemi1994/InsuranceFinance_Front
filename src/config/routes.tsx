import React from "react";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import People from "../pages/people/People";
import Company from "../pages/company/Company";
import InsurancePolicy from "../pages/insruancePolicy/InsurancePolicy";
import InsuranceFee from "../pages/insuranceFee/InsuranceFee";
import Marketer from "../pages/marketer/Marketer";
import BankAccount from "../pages/bankAccount/BankAccount";
import Form from "../pages/form/Form";
import CreateForm from "../pages/form/CreateNewForm";
import AttachmentType from "../pages/attachment/AttachmentType";
import InstallmentDetail from "../pages/insruancePolicy/components/installment/InstallmentDetail";
import InstallmentManagent from "../pages/finance/installment/InstallmentManagent";
import SignoutCallbackPage from "../pages/SignoutCallbackPage";
import CallbackPage from "../pages/CallbackPage";
import WalletTransaction from "../pages/finance/wallet/WalletTransaction";
import GeneralReport from "../pages/finance/reports/GeneralReport";
import Notfound from "../pages/Notfound";
import VehicleIndex from "@/pages/vehicle/vehicle-index";
import User from "@/pages/users/User";
import ReminderSetting from "@/pages/reminder/ReminderSetting";
import Addendum from "../pages/insruancePolicy/addendum/Addendum";
import AddendumList from "@/pages/insruancePolicy/addendum/AddendumList";
import Permission from "@/pages/permission/Permission";
import Branch from "@/pages/office/Branch";

const Layout = lazy(() => import("../components/layout/Layout"))
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"))
const InsurancePolicyManagement = lazy(() => import("../pages/insruancePolicy/InsurancePolicyManagement"))


export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signin-oidc',
        element: <CallbackPage />,
    },
    {
        path: '/signout-callback-oidc',
        element: <SignoutCallbackPage />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: '*',
                element: <Notfound />
            },
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: '/people',
                element: <People />,
            },
            {
                path: '/marketer',
                element: <Marketer />,
            },
            {
                path: '/insurance-fee',
                element: <InsuranceFee />
            },
            {
                path: '/insurance-company',
                element: <Company />
            },
            {
                path: '/insurance-policy/archive',
                element: <InsurancePolicy />,
            },
            {
                path: '/insurance-policy/create',
                element: <InsurancePolicyManagement />
            },
            {
                path: '/bank-account',
                element: <BankAccount />
            },
            {
                path: '/insurance-policy/form',
                element: <Form />
            },
            {
                path: '/insurance-policy/form/create',
                element: <CreateForm />
            },
            {
                path: '/attachment-types',
                element: <AttachmentType />
            },
            {
                path: '/policy-installment-detail',
                element: <InstallmentDetail />
            },
            {
                path: '/finance-installments',
                element: <InstallmentManagent />
            },
            {
                path: '/wallet-transaction',
                element: <WalletTransaction />
            },
            {
                path: '/general-report',
                element: <GeneralReport />
            },
            {
                path: '/addendum',
                element: <Addendum />
            },
            {
                path: '/vehicle',
                element: <VehicleIndex />
            },
            {
                path: '/users',
                element: <User />
            },
            {

                path: '/reminder-setting',
                element: <ReminderSetting />
            },
            {

                path: '/addendum-list',
                element: <AddendumList />
            },
            {
                path: '/permissions',
                element:<Permission />
            },
            {
                path:'/office/branch',
                element:<Branch />
            }
        ]
    }
])