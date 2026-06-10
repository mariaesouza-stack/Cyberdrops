import { Injectable } from '@angular/core';

export type ShareResult = 'native' | 'copied' | 'cancelled' | 'failed';

export interface ShareContent {
  title: string;
  text: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class ShareService {
  async share(content: ShareContent): Promise<ShareResult> {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(content);
        return 'native';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      }
    }

    return this.copyFallback(content.url);
  }

  private async copyFallback(url: string): Promise<ShareResult> {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
}
