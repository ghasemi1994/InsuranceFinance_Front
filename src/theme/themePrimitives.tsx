import { createTheme, alpha, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module '@mui/material/styles' {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }


  interface PaletteColor extends ColorRange { }

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

// ==================== رنگ‌های اصلی برند (آبی دودی مدرن) ====================
export const brand = {
  50: '#EFF6FF',   // بسیار روشن
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',   // اصلی (آبی متعادل و مدرن)
  600: '#2563EB',
  700: '#1D4ED8',   // تیره برای کنتراست
  800: '#1E40AF',
  900: '#1E3A8A',
  950: '#172554',
};

// ==================== خاکستری‌های نرم و حرفه‌ای ====================
export const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

// ==================== سبز (برای موفقیت و تایید) ====================
export const green = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
};

// ==================== نارنجی (هشدار - ملایم و هشداردهنده اما نه تحریک‌کننده) ====================
export const orange = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
};

// ==================== قرمز (خطا - خوانا و ملایم) ====================
export const red = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
};

// ==================== تابع تولید توکن‌های تم ====================
export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? '0px 4px 16px rgba(0, 0, 0, 0.4), 0px 8px 16px -5px rgba(0, 0, 0, 0.6)'
      : '0px 4px 16px rgba(0, 0, 0, 0.05), 0px 8px 16px -5px rgba(0, 0, 0, 0.05)';

  return {
    palette: {
      mode,
      primary: {
        light: brand[300],
        main: brand[500],
        dark: brand[700],
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: brand[400],
          main: brand[600],
          dark: brand[800],
        }),
      },
      secondary: {
        // برای بخش‌های فرعی و المان‌های مکمل (فیروزه‌ای ملایم)
        light: '#99F6E4',
        main: '#14B8A6',
        dark: '#0F766E',
        contrastText: '#fff',
        ...(mode === 'dark' && {
          light: '#2DD4BF',
          main: '#14B8A6',
          dark: '#0F766E',
        }),
      },
      info: {
        light: brand[200],
        main: brand[400],
        dark: brand[600],
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: brand[300],
          main: brand[500],
          dark: brand[700],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[600],
          dark: orange[800],
        }),
      },
      error: {
        light: red[300],
        main: red[500],
        dark: red[700],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[600],
          dark: red[800],
        }),
      },
      success: {
        light: green[300],
        main: green[500],
        dark: green[700],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[600],
          dark: green[800],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: mode === 'dark' ? gray[900] : '#F8FAFC',  // کمی متمایل به آبی بسیار روشن برای حس حرفه‌ای
        paper: mode === 'dark' ? gray[800] : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? gray[100] : gray[800],
        secondary: mode === 'dark' ? gray[400] : gray[600],
        disabled: mode === 'dark' ? gray[500] : gray[400],
      },
      action: {
        hover: mode === 'dark' ? alpha(gray[600], 0.2) : alpha(gray[200], 0.3),
        selected: mode === 'dark' ? alpha(gray[600], 0.3) : alpha(gray[200], 0.4),
        disabled: mode === 'dark' ? alpha(gray[500], 0.3) : alpha(gray[400], 0.3),
        disabledBackground: mode === 'dark' ? alpha(gray[700], 0.5) : alpha(gray[200], 0.5),
        focus: mode === 'dark' ? alpha(gray[500], 0.2) : alpha(gray[300], 0.2),
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(16),
        fontWeight: 500,
        lineHeight: 1.4,
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
        lineHeight: 1.5,
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(13),
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',  // دکمه‌ها با حروف معمولی (حرفه‌ای‌تر)
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,  // گوشه‌های نرم و مدرن
    },
    shadows: customShadows,
  };
};

// ==================== طرح رنگ روشن (Light) ====================
export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[300],
        main: brand[500],
        dark: brand[700],
        contrastText: '#fff',
      },
      secondary: {
        light: '#99F6E4',
        main: '#14B8A6',
        dark: '#0F766E',
        contrastText: '#fff',
      },
      info: {
        light: brand[200],
        main: brand[400],
        dark: brand[600],
        contrastText: '#fff',
      },
      warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[300],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
      },
      action: {
        hover: alpha(gray[200], 0.3),
        selected: alpha(gray[200], 0.4),
      },
      baseShadow: '0px 4px 16px rgba(0, 0, 0, 0.05), 0px 8px 16px -5px rgba(0, 0, 0, 0.05)',
    },
  },
  dark: {
    palette: {
      primary: {
        light: brand[400],
        main: brand[600],
        dark: brand[800],
        contrastText: '#fff',
      },
      secondary: {
        light: '#2DD4BF',
        main: '#14B8A6',
        dark: '#0F766E',
        contrastText: '#fff',
      },
      info: {
        light: brand[300],
        main: brand[500],
        dark: brand[700],
        contrastText: '#fff',
      },
      warning: {
        light: orange[400],
        main: orange[600],
        dark: orange[800],
      },
      error: {
        light: red[400],
        main: red[600],
        dark: red[800],
      },
      success: {
        light: green[400],
        main: green[600],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: gray[800],
      },
      text: {
        primary: gray[100],
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow: '0px 4px 16px rgba(0, 0, 0, 0.4), 0px 8px 16px -5px rgba(0, 0, 0, 0.6)',
    },
  },
};

// ==================== تایپوگرافی نهایی ====================
export const typography = {
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
};

// ==================== شکل و سایه‌ها ====================
export const shape = {
  borderRadius: 12,
};

const defaultShadows: Shadows = [...defaultTheme.shadows];
defaultShadows[1] = '0px 4px 16px rgba(0, 0, 0, 0.05), 0px 8px 16px -5px rgba(0, 0, 0, 0.05)';

export const shadows = defaultShadows;