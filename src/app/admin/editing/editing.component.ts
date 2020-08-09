import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { LanguageService } from 'src/app/services/languages/languages.service';
import { FormTitles } from '../../classes-const/menuFormTitles';
import { Titles } from '../../classes-const/Titles';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.css']
})
export class EditingComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private formService: LanguageService) {

   }
  editorPlaceholder:string = '';
  id:any;
  idUnsubscribe;
  language:string;
  languageUnsubscribe;

  ngOnInit(): void {
    this.idUnsubscribe = this.activatedRoute.params.subscribe(prm => {
      this.id = prm['id'];
    });
    this.getLanguage();
    this.getLanguageIfChange();
    this.editorPlaceholder = Titles[this.language]['editorPlaceholder'];
  }
  getLanguage(){
    this.language = this.formService.getLanguage();
  }
  getLanguageIfChange(){
    this.languageUnsubscribe = this.formService.language.subscribe(lng => {
      this.language = lng;
      this.editorPlaceholder = Titles[lng]['editorPlaceholder'];

      //set direction of editor by selected language
      document.querySelectorAll('.ql-editor').forEach(el => {
        (el as HTMLBodyElement).style.textAlign = lng != 'heb' ? 'left' : 'right';
      });
    });

  }
  changeEditor(event: EditorChangeContent | EditorChangeSelection){
    console.log(event['editor']['root']['innerHTML']);
  }

  ngOnDestroy(){
    this.idUnsubscribe.unsubscribe();
    this.languageUnsubscribe.unsubscribe();
  }

}
