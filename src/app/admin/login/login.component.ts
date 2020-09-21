import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/languages/languages.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private languageService: LanguageService, private route: Router) { }

  ngOnInit(): void {
  }
async login(){
   //await this.languageService.getSettings();
   this.route.navigate(['/admin']);

  }
}
