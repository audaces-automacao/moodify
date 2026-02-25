import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MoodBoardResponse, OutfitSuggestion } from '../models/mood-board.model';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  max_tokens: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface DallERequest {
  model: string;
  prompt: string;
  n: number;
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  response_format: 'url' | 'b64_json';
}

interface DallEResponse {
  created: number;
  data: { url: string; revised_prompt?: string }[];
}

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  401: 'errors.invalidApiKey',
  429: 'errors.rateLimited',
  500: 'errors.serviceUnavailable',
};

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  generateMoodBoard(prompt: string): Observable<MoodBoardResponse> {
    const request: OpenAIRequest = {
      model: environment.openaiModel,
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: this.buildUserPrompt(prompt) },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    };

    return this.http.post<OpenAIResponse>(environment.openaiApiUrl, request).pipe(
      map(response => this.parseResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  private buildSystemPrompt(): string {
    const languageInstruction =
      this.transloco.getActiveLang() === 'pt-BR'
        ? 'Respond in Brazilian Portuguese.'
        : 'Respond in English.';

    return `You are an expert fashion stylist and mood board curator. Generate fashion mood boards based on user descriptions. ${languageInstruction} Always respond with valid JSON matching the exact schema provided. Do not include any markdown formatting or code blocks - just raw JSON.`;
  }

  private buildUserPrompt(userInput: string): string {
    return `Create a fashion mood board for: "${userInput}"

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "colorPalette": [
    {"name": "Color Name", "hex": "#HEXCODE", "usage": "primary|secondary|accent|neutral|highlight"}
  ],
  "fabrics": [
    {"name": "Fabric Name", "description": "Why this fabric fits", "texture": "Tactile description", "season": "Best season"}
  ],
  "styleKeywords": ["keyword1", "keyword2"],
  "outfitSuggestions": {
    "top": "Specific garment description",
    "bottom": "Specific garment description",
    "shoes": "Specific footwear description",
    "accessories": ["accessory1", "accessory2"],
    "outerwear": "Optional outerwear or null"
  },
  "aestheticDescription": "2-3 sentence description of the overall aesthetic"
}

Requirements:
- Provide exactly 5-6 colors in colorPalette
- Provide exactly 3-4 fabric recommendations
- Provide 6-8 style keywords
- Provide 2-4 accessories
- Be specific and fashion-forward in descriptions`;
  }

  private parseResponse(response: OpenAIResponse): MoodBoardResponse {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(this.transloco.translate('errors.noResponse'));
    }

    const cleanedContent = this.stripMarkdownCodeBlocks(content);

    try {
      return JSON.parse(cleanedContent) as MoodBoardResponse;
    } catch {
      throw new Error(this.transloco.translate('errors.parseError'));
    }
  }

  private stripMarkdownCodeBlocks(content: string): string {
    return content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  private handleError(error: { status?: number; message?: string }): Observable<never> {
    const errorKey = HTTP_ERROR_MESSAGES[error.status ?? 0];
    const message = errorKey
      ? this.transloco.translate(errorKey)
      : error.message || this.transloco.translate('errors.generic');

    return throwError(() => new Error(message));
  }

  generateOutfitImage(outfit: OutfitSuggestion, styleKeywords: string[]): Observable<string> {
    const request: DallERequest = {
      model: environment.dalleModel,
      prompt: this.buildImagePrompt(outfit, styleKeywords),
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    };

    return this.http.post<DallEResponse>(environment.dalleApiUrl, request).pipe(
      map(response => {
        const url = response.data?.[0]?.url;
        if (!url) {
          throw new Error(this.transloco.translate('errors.imageGenericError'));
        }
        return url;
      }),
      catchError(error => this.handleImageError(error))
    );
  }

  private buildImagePrompt(outfit: OutfitSuggestion, styleKeywords: string[]): string {
    const outfitDescription = [
      outfit.top,
      outfit.bottom,
      outfit.shoes,
      outfit.outerwear,
      ...outfit.accessories,
    ]
      .filter(Boolean)
      .join(', ');

    const styleDescription = styleKeywords.slice(0, 5).join(', ');

    return `Fashion editorial photograph of a complete outfit on a mannequin or flat lay: ${outfitDescription}. Style: ${styleDescription}. High-end fashion photography, luxury magazine aesthetic, professional lighting, clean background.`;
  }

  private handleImageError(error: { status?: number; message?: string }): Observable<never> {
    const errorKey =
      error.status === 400 ? 'errors.imagePromptRejected' : HTTP_ERROR_MESSAGES[error.status ?? 0];

    const message = errorKey
      ? this.transloco.translate(errorKey)
      : error.message || this.transloco.translate('errors.imageGenericError');

    return throwError(() => new Error(message));
  }
}
