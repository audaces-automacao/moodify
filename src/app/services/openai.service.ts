import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MoodBoard,
  MoodBoardAPIResponse,
  OpenAIResponse,
  AppError
} from '../models/mood-board.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private http = inject(HttpClient);

  generateMoodBoard(userPrompt: string): Observable<MoodBoard> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`
    });

    const body = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: this.buildUserPrompt(userPrompt) }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    };

    return this.http.post<OpenAIResponse>(this.API_URL, body, { headers }).pipe(
      map(response => this.parseResponse(response, userPrompt)),
      catchError(error => this.handleError(error))
    );
  }

  private getSystemPrompt(): string {
    return `You are an elite fashion stylist and mood board curator with expertise in color theory, textile science, and contemporary fashion trends. Your role is to create cohesive, inspiring fashion mood boards based on user descriptions.

CRITICAL: You MUST respond with valid JSON only. No markdown, no explanations outside JSON.

Your responses must follow this exact JSON structure:
{
  "aestheticTitle": "string (3-5 words, evocative title for the mood board)",
  "aestheticDescription": "string (2-3 sentences describing the overall vibe, atmosphere, and fashion story)",
  "colorPalette": [
    {
      "hex": "string (valid hex color code, e.g., #1A1A2E)",
      "name": "string (creative, evocative color name)",
      "description": "string (how this color contributes to the aesthetic)"
    }
  ],
  "fabrics": [
    {
      "name": "string (specific fabric type)",
      "description": "string (texture, feel, visual qualities)",
      "bestFor": "string (garment types this works for)",
      "texture": "string (one of: smooth, textured, soft, structured, flowing, crisp)"
    }
  ],
  "styleKeywords": ["string (fashion-relevant descriptive tags)"],
  "outfit": {
    "top": {
      "item": "string (specific garment)",
      "details": "string (color, fabric, cut details)",
      "styling": "string (how to wear it)"
    },
    "bottom": {
      "item": "string",
      "details": "string",
      "styling": "string"
    },
    "shoes": {
      "item": "string",
      "details": "string",
      "styling": "string"
    },
    "accessories": [
      {
        "item": "string",
        "details": "string",
        "styling": "string"
      }
    ]
  },
  "season": "string (appropriate season(s))",
  "occasion": "string (event/setting this works for)",
  "moodWords": ["string (3-4 emotional/atmospheric words)"]
}

REQUIREMENTS:
- colorPalette: Exactly 5-6 colors that work harmoniously together
- fabrics: Exactly 3-4 fabric recommendations
- styleKeywords: 8-12 relevant style tags
- accessories: 2-3 items
- All hex codes must be valid 6-digit codes with # prefix
- Be specific, creative, and fashion-forward
- Consider wearability and cohesion
- Match the user's described occasion/vibe precisely`;
  }

  private buildUserPrompt(input: string): string {
    return `Create a complete fashion mood board for the following style request:

"${input}"

Remember to:
1. Interpret the vibe, occasion, and any specific requirements mentioned
2. Create a cohesive color palette that evokes the described mood
3. Suggest fabrics that match the formality and season implied
4. Provide a complete, wearable outfit
5. Include style keywords that capture the essence
6. Write an inspiring aesthetic description

Respond ONLY with the JSON object. No additional text.`;
  }

  private parseResponse(response: OpenAIResponse, userPrompt: string): MoodBoard {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw this.createParseError('Empty response from API');
    }

    let parsed: MoodBoardAPIResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw this.createParseError('Invalid JSON in response');
    }

    this.validateMoodBoardResponse(parsed);

    return {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      userPrompt,
      aestheticTitle: parsed.aestheticTitle,
      aestheticDescription: parsed.aestheticDescription,
      colorPalette: parsed.colorPalette,
      fabrics: parsed.fabrics.map(f => ({
        ...f,
        texture: f.texture as MoodBoard['fabrics'][0]['texture']
      })),
      styleKeywords: parsed.styleKeywords,
      outfit: parsed.outfit,
      season: parsed.season,
      occasion: parsed.occasion,
      moodWords: parsed.moodWords
    };
  }

  private validateMoodBoardResponse(data: MoodBoardAPIResponse): void {
    const required = ['aestheticTitle', 'colorPalette', 'fabrics', 'styleKeywords', 'outfit'];
    for (const field of required) {
      if (!(field in data)) {
        throw this.createParseError(`Missing required field: ${field}`);
      }
    }

    if (!data.colorPalette || data.colorPalette.length < 5) {
      throw this.createParseError('Insufficient color palette items');
    }

    for (const color of data.colorPalette) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(color.hex)) {
        throw this.createParseError(`Invalid hex code: ${color.hex}`);
      }
    }
  }

  private createParseError(message: string): AppError {
    return {
      type: 'PARSE_ERROR',
      message,
      userMessage: 'The AI response was unexpected. Please try again.',
      retryable: true
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let appError: AppError;

    if (error.status === 0) {
      appError = {
        type: 'NETWORK_ERROR',
        message: error.message,
        userMessage: 'Unable to connect. Please check your internet connection.',
        retryable: true
      };
    } else if (error.status === 401) {
      appError = {
        type: 'API_KEY_INVALID',
        message: 'Invalid API key',
        userMessage: 'There was an authentication issue. Please check your API configuration.',
        retryable: false
      };
    } else if (error.status === 429) {
      appError = {
        type: 'RATE_LIMIT',
        message: 'Rate limit exceeded',
        userMessage: "We're experiencing high demand. Please try again in a moment.",
        retryable: true
      };
    } else if (error.status >= 500) {
      appError = {
        type: 'UNKNOWN_ERROR',
        message: error.message,
        userMessage: 'The AI service is temporarily unavailable. Please try again.',
        retryable: true
      };
    } else {
      appError = {
        type: 'UNKNOWN_ERROR',
        message: error.message,
        userMessage: 'Something went wrong. Please try again.',
        retryable: true
      };
    }

    return throwError(() => appError);
  }
}
