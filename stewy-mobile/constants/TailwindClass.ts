export const TailwindClasses = {
  light: {
    background: 'bg-[#F2F5F7]',
    surface: 'bg-white',
    surfaceAlt: 'bg-[#E7EEFF]',

    border: 'border-[#BECAB9]',
    borderStrong: 'border-[#6F7A6C]',

    text: 'text-[#111C2D]',
    textMuted: 'text-[#3F4A3D]',
    textSubtle: 'text-[#6F7A6C]',
    textInverse: 'text-white',
    textAccent: 'text-[#005318]',

    accentBg: 'bg-[#006B22]',
    accentSubtle: 'bg-[#E7F5E8]',

    tint: 'text-[#006B22]',
    tabIconDefault: '#6F7A6C',
    tabIconSelected: '#006B22',
    icon: '#3F4A3D',

    successBg: 'bg-[#E7F5E8]',
    successText: 'text-[#005318]',
    warningBg: 'bg-[#FFF8E1]',
    warningText: 'text-[#6B5200]',
    dangerBg: 'bg-[#FFDAD6]',
    dangerText: 'text-[#93000A]',
    infoBg: 'bg-[#E1F0FF]',
    infoText: 'text-[#0D4368]',
  },

  dark: {
    background: 'bg-[#0B121D]',
    surface: 'bg-[#111C2D]',
    surfaceAlt: 'bg-[#1E293B]',

    border: 'border-[#3F4A3D]',
    borderStrong: 'border-[#8E918F]',

    text: 'text-[#ECF1FF]',
    textMuted: 'text-[#D8E3FB]',
    textSubtle: 'text-[#6F7A6C]',
    textInverse: 'text-[#0B121D]',
    textAccent: 'text-[#91FA95]',

    accentBg: 'bg-[#2D963F]',
    accentSubtle: 'bg-[#1E293B]',

    tint: 'text-[#2D963F]',
    tabIconDefault: '#D8E3FB',
    tabIconSelected: '#2D963F',
    icon: '#D8E3FB',

    successBg: 'bg-[#1E293B]',
    successText: 'text-[#91FA95]',
    warningBg: 'bg-[#3A2E00]',
    warningText: 'text-[#FFD84D]',
    dangerBg: 'bg-[#690005]',
    dangerText: 'text-[#FFB4AB]',
    infoBg: 'bg-[#003256]',
    infoText: 'text-[#81D4FF]',
  },
} as const;

export type TailwindColorKey = keyof typeof TailwindClasses.light;
