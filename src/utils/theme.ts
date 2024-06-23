import {Platform} from 'react-native';
import {MD3LightTheme, useTheme} from 'react-native-paper';

export const theme: any = {
  ...MD3LightTheme,

  // Specify a custom property
  custom: 'property',

  // Specify a custom property in nested object
  colors: {
    ...MD3LightTheme.colors,

    neutral500: '#1D1D1D',
    neutral400: '#1A1A1A',
    neutral300: '#686868',
    neutral250: '#9C9C9C',
    neutral200: '#B5B5B5',
    neutral100: '#E8E8E8',
    neutral50: '#FAFAFA',

    primary: '#4D9D98',
    primary300: '#63aeaa',
    primary200: '#8bc5c3',
    primary50: '#e2f0f0',

    success600: '#419E6A',
    success400: '#A5E1BF',
    success50: '#E8FCF1',

    warning600: '#F9C51C',
    warning400: '#FCF17E',
    warning50: '#FEFCE4',

    error600: '#D83232',
    error400: '#FC9595',
    error50: '#FFEBEB',

    black: '#000',
    white: '#fff',

    surfaceDisabled: '#E8E8E8',
    onSurfaceDisabled: '#B5B5B5',
    elevation: {
      level2: '#ffffff',
    },
  },
  fonts: {
    // Title 1
    headlineLarge: {
      fontFamily: Platform.select({
        web: 'Inter-Bold, sans-serif',
        ios: 'Inter-Bold',
        default: 'Inter-Bold',
      }),
      fontWeight: '700',
      fontSize: 32,
      lineHeight: 40,
    },

    // Title 2
    headlineMedium: {
      fontFamily: Platform.select({
        web: 'Inter-Bold, sans-serif',
        ios: 'Inter-Bold',
        default: 'Inter-Bold',
      }),
      fontWeight: '700',
      fontSize: 24,
      lineHeight: 32,
    },

    // Title 3
    headlineSmall: {
      fontFamily: Platform.select({
        web: 'Inter-Bold, sans-serif',
        ios: 'Inter-Bold',
        default: 'Inter-Bold',
      }),
      fontWeight: '700',
      fontSize: 18,
      lineHeight: 24,
    },

    // Title 4
    titleLarge: {
      fontFamily: Platform.select({
        web: 'Inter-SemiBold, sans-serif',
        ios: 'Inter-SemiBold',
        default: 'Inter-SemiBold',
      }),
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 20,
    },
    titleMedium: {
      fontFamily: Platform.select({
        web: 'Inter-Medium, sans-serif',
        ios: 'Inter-Medium',
        default: 'Inter-Medium',
      }),
      fontWeight: '500',
      fontSize: 16,
      lineHeight: 20,
    },
    titleSmall: {
      fontFamily: Platform.select({
        web: 'Inter-Regular, sans-serif',
        ios: 'Inter-Regular',
        default: 'Inter-Regular',
      }),
      fontWeight: '400',
      fontSize: 16,
      lineHeight: 20,
    },

    // Body
    bodyLarge: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      fontFamily: Platform.select({
        web: 'Inter-SemiBold, sans-serif',
        ios: 'Inter-SemiBold',
        default: 'Inter-SemiBold',
      }),
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '500',
      fontFamily: Platform.select({
        web: 'Inter-Medium',
        ios: 'Inter-Medium',
        default: 'Inter-Medium',
      }),
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 18,
      fontFamily: Platform.select({
        web: 'Inter-Regular',
        ios: 'Inter-Regular',
        default: 'Inter-Regular',
      }),
    },

    // Caption 1
    labelLarge: {
      fontFamily: Platform.select({
        web: 'Inter-SemiBold, sans-serif',
        ios: 'Inter-SemiBold',
        default: 'Inter-SemiBold',
      }),
      fontWeight: '600',
      fontSize: 11,
      lineHeight: 14,
    },
    labelMedium: {
      fontFamily: Platform.select({
        web: 'Inter-Medium, sans-serif',
        ios: 'Inter-Medium',
        default: 'Inter-Medium',
      }),
      fontWeight: '500',
      fontSize: 11,
      lineHeight: 14,
    },
    labelSmall: {
      fontFamily: Platform.select({
        web: 'Inter-Regular, sans-serif',
        ios: 'Inter-Regular',
        default: 'Inter-Regular',
      }),
      fontSize: 11,
      lineHeight: 14,
    },
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();
