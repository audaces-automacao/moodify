export interface MoodBoardResponse {
  colorPalette: ColorSwatch[];
  fabrics: FabricRecommendation[];
  styleKeywords: string[];
  outfitSuggestions: OutfitSuggestion;
  aestheticDescription: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'highlight';
}

export interface FabricRecommendation {
  name: string;
  description: string;
  texture: string;
  season: string;
}

export interface OutfitSuggestion {
  top: string;
  bottom: string;
  shoes: string;
  accessories: string[];
  outerwear?: string;
}
