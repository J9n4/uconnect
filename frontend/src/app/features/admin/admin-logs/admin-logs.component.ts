import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  template: `
    <div class="logs-wrapper">
      <iframe
        [src]="logsUrl"
        class="logs-iframe"
        frameborder="0"
        allowfullscreen>
      </iframe>
    </div>
  `,
  styles: [`
    .logs-wrapper {
      width: 100%;
      height: calc(100vh - 70px);
      overflow: hidden;
      border-radius: 12px;
      background: #0f172a;
    }

    .logs-iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    }
  `]
})
export class AdminLogsComponent {
  logsUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.logsUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8000/admin/logs');
  }
}
