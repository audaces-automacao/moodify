import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MoodBoardResponse } from '../models/mood-board.model';

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

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  private http = inject(HttpClient);
  private transloco = inject(TranslocoService);

  private buildSystemPrompt(): string {
    const lang = this.transloco.getActiveLang();
    const languageInstruction =
      lang === 'pt-BR' ? 'Respond in Brazilian Portuguese.' : 'Respond in English.';

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

  generateMoodBoard(prompt: string): Observable<MoodBoardResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.openaiApiKey}`,
    });

    const request: OpenAIRequest = {
      model: environment.openaiModel,
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: this.buildUserPrompt(prompt) },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    };

    return this.http.post<OpenAIResponse>(environment.openaiApiUrl, request, { headers }).pipe(
      map((response) => {
        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error(this.transloco.translate('errors.noResponse'));
        }

        // Clean the response - remove any markdown code blocks if present
        const cleanedContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        try {
          return JSON.parse(cleanedContent) as MoodBoardResponse;
        } catch {
          throw new Error(this.transloco.translate('errors.parseError'));
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new Error(this.transloco.translate('errors.invalidApiKey')));
        }
        if (error.status === 429) {
          return throwError(() => new Error(this.transloco.translate('errors.rateLimited')));
        }
        if (error.status === 500) {
          return throwError(() => new Error(this.transloco.translate('errors.serviceUnavailable')));
        }
        return throwError(
          () => new Error(error.message || this.transloco.translate('errors.generic')),
        );
      }),
    );
  }
}
