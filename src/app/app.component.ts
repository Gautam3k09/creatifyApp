import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { localStorageService } from './local-storage-service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    providers: [localStorageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'creatifyApp';
    merchName: any;
    constructor(
        route: ActivatedRoute,
        private localStorage: localStorageService
    ) {
        this.merchName = route.snapshot.params['userName'];
        const localData: any = {
            LoggedIn: true,
            visitor: JSON.stringify(this.merchName),
        };
        // this.localStorage.setUserLocalStorage(localData);
    }
    ngOnInit() {}
}
