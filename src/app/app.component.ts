import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'oshop';
  onScanPage: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute){
      this.route.url.subscribe(url => {
        console.log('urlseg', url);
        this.onScanPage = url.includes(new UrlSegment('scanner', {}));
      });
    }
  goToScan() {
    this.router.navigate(['/scanner']);
  }
}
