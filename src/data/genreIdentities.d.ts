export interface GenreColors {
  bgColor: string;
  cardBg: string;
  titleColor: string;
  subtitleColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  overlayColor: string;
}

export interface GenreFonts {
  title: string;
  subtitleFont: string;
  body: string;
  labelFont: string;
  weight: string;
  tracking: string;
  transform: string;
}

export interface GenreSpacing {
  sectionGap: string;
  cardPadding: string;
  titleSize: string;
  bodySize: string;
}

export interface GenreIdentity {
  id: string;
  label: string;
  emoji: string;
  mood: string[];
  fonts: GenreFonts;
  colors: GenreColors;
  spacing: GenreSpacing;
  googleFonts: string[];
}

export declare const genreIdentities: GenreIdentity[];
