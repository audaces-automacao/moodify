// Color palette item
export interface ColorItem {
  hex: string;
  name: string;
  description: string;
}

// Fabric recommendation
export interface FabricRecommendation {
  name: string;
  description: string;
  bestFor: string;
  texture: 'smooth' | 'textured' | 'soft' | 'structured' | 'flowing' | 'crisp';
}

// Outfit item
export interface OutfitItem {
  item: string;
  details: string;
  styling: string;
}

// Complete outfit suggestion
export interface OutfitSuggestion {
  top: OutfitItem;
  bottom: OutfitItem;
  shoes: OutfitItem;
  accessories: OutfitItem[];
}

// Complete mood board
export interface MoodBoard {
  id: string;
  createdAt: Date;
  userPrompt: string;
  aestheticTitle: string;
  aestheticDescription: string;
  colorPalette: ColorItem[];
  fabrics: FabricRecommendation[];
  styleKeywords: string[];
  outfit: OutfitSuggestion;
  season: string;
  occasion: string;
  moodWords: string[];
}

// Raw API response structure from GPT
export interface MoodBoardAPIResponse {
  aestheticTitle: string;
  aestheticDescription: string;
  colorPalette: {
    hex: string;
    name: string;
    description: string;
  }[];
  fabrics: {
    name: string;
    description: string;
    bestFor: string;
    texture: string;
  }[];
  styleKeywords: string[];
  outfit: {
    top: { item: string; details: string; styling: string };
    bottom: { item: string; details: string; styling: string };
    shoes: { item: string; details: string; styling: string };
    accessories: { item: string; details: string; styling: string }[];
  };
  season: string;
  occasion: string;
  moodWords: string[];
}

// OpenAI API response types
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
}

// Error types
export type ErrorType =
  | 'NETWORK_ERROR'
  | 'API_KEY_INVALID'
  | 'RATE_LIMIT'
  | 'PARSE_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  retryable: boolean;
}

// App state
export type AppState = 'idle' | 'loading' | 'success' | 'error';

// Example prompt
export interface ExamplePrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'casual' | 'formal' | 'creative' | 'seasonal';
}
