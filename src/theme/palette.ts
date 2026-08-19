import { type PaletteOptions } from "@mui/material";

export const palette: PaletteOptions = {
    mode: 'light',

    primary: {
        main: '#6366F1',      // بنفش-آبی ایندگو (جذاب‌تر و مدرن‌تر از آبی ساده)
        light: '#818CF8',     
        dark: '#4F46E5',      
        contrastText: '#ffffff',
    },

    secondary: {
        main: '#F43F5E',      // صورتی-قرمز رز (برای اکشن‌های مهم و پررنگ)
        light: '#FB7185',
        dark: '#E11D48',
        contrastText: '#ffffff',
    },

    error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
        contrastText: '#ffffff',
    },

    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
        contrastText: '#ffffff',
    },

    info: {
        main: '#06B6D4',      // فیروزه‌ای-آبی (جذاب‌تر از sky)
        light: '#22D3EE',
        dark: '#0891B2',
        contrastText: '#ffffff',
    },

    success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrastText: '#ffffff',
    },

    grey: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
    },

    text: {
        primary: '#1E293B',    // کمی نرم‌تر از مشکی
        secondary: '#64748B',
        disabled: '#94A3B8',
    },

    background: {
        default: '#F8FAFC',    // slate-50 بسیار روشن و آرام‌بخش
        paper: '#FFFFFF',
    },

    divider: '#E2E8F0',

    action: {
        active: '#64748B',
        hover: 'rgba(99, 102, 241, 0.04)',
        selected: 'rgba(99, 102, 241, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.08)',
        focus: 'rgba(99, 102, 241, 0.12)',
    },
};

export default palette;