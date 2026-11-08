import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthPromptService {
  private readonly loginAndSignupPromptRequested = new Subject<void>();

  readonly loginAndSignupPromptRequested$ = this.loginAndSignupPromptRequested.asObservable();

  showWarningAndHighlightLoginAndSignUp(): void {
    this.loginAndSignupPromptRequested.next();
  }
}
