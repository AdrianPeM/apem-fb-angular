import { Component, OnInit } from '@angular/core';
import { LoadingAppService } from 'src/app/services/loading-app.service';

@Component({
  selector: 'app-loading-app',
  templateUrl: './loading-app.component.html',
  styleUrls: ['./loading-app.component.scss']
})
export class LoadingAppComponent implements OnInit {

  constructor(private loadingAppService: LoadingAppService) { }

  ngOnInit(): void {
  }

  isLoading(): boolean {
    return this.loadingAppService.loading
  }

}
