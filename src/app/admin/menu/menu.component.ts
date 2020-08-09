import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { LanguageService } from '../../services/languages/languages.service';
import { FormTitles } from '../../classes-const/menuFormTitles';
import { GetSetDataService } from '../../services/getSetData/get-set-data.service';
import { Menu } from '../../classes-const/menuClass';
import { Alert } from '../../classes-const/alerts';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private fb: FormBuilder, private formService: LanguageService, private getSetData: GetSetDataService) { }


  addMenuTooltip: string;
  createMenuTitle: string;
  createMenuButton: string;
  titleInputAddMenu: string;

  clickedToCreateMenu: boolean = false;
  clickedToOpenAddMenuForm: boolean = false;

  idOfSelectedNode: number = -1;
  openFormButton: string = 'keyboard_arrow_down';

  language: string;
  languageToUnSub;
  alert: string;
  childrenFormAlert: string;
  error: boolean = false;
  spinner: boolean = false;
  spinnerChild: boolean = false;
  formView: boolean = true;
  iconControl: number;
  closeMenuTooltip: string;
  addMenuFormView: string = 'addMenuFormView';
  //addMenuIcon = 'add';
  menu: Menu[];
  createMenuForm = this.fb.group({
    title: ['', Validators.required]
  });
  addMenuForm = this.fb.group({});

  treeControl = new NestedTreeControl<Menu>(node => node.children);
  dataSource;
  hasChild = (_: number, node: Menu) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.getLanguage();
    this.getLanguageIfChange();
    this.getMenu();
  }

  getLanguage() {
    this.language = this.formService.getLanguage();
    this.addMenuTooltip = FormTitles[this.language].tooltipAddMenu;
    this.createMenuTitle = FormTitles[this.language].titleFormAddMenu;
    this.createMenuButton = FormTitles[this.language].buttonSaveAddMenu;
    this.titleInputAddMenu = FormTitles[this.language].titleInputAddMenu;
    this.closeMenuTooltip = FormTitles[this.language].tooltipCloseMenu;
  }
  getLanguageIfChange() {
    this.languageToUnSub = this.formService.language.subscribe(lng => {
      this.language = lng;
      this.addMenuTooltip = FormTitles[lng].tooltipAddMenu
      this.createMenuTitle = FormTitles[lng].titleFormAddMenu;
      this.createMenuButton = FormTitles[lng].buttonSaveAddMenu;
      this.titleInputAddMenu = FormTitles[lng].titleInputAddMenu;
      this.closeMenuTooltip = FormTitles[lng].tooltipCloseMenu;
    });
  }
  openCreateMenu() {
    debugger
    this.clickedToCreateMenu = !this.clickedToCreateMenu;
    this.openFormButton = this.clickedToCreateMenu ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  saveNewMenu(menuName, parentData?) {
    let newMenu;
    if (parentData == undefined) {
      if (this.createMenuForm.valid) {
        this.spinner = true;
        newMenu = {
          name: menuName.title,
          level: 0,
          parentId: null
        }
      }
    } else {
      if (this.addMenuForm.valid) {
        this.spinnerChild = true;
        newMenu = {
          name: menuName,
          level: (+parentData.level + 1).toString(),
          parentId: parentData.id
        }
      }
    }
    this.getSetData.saveMenu(newMenu).subscribe(saved => {
      this.error = saved.includes('SUCCESS') ? false : true;
      if (saved.includes('SUCCESS')) {
        if (parentData != undefined) {
          this.spinnerChild = false;
          this.childrenFormAlert = saved.includes('SUCCESS') ? Alert[this.language].alertSaved : Alert[this.language].alertError;
          // this.addMenuForm.get('title' + parentData.id).setValue('');
          // this.addMenuFormView = 'addMenuFormView';
        }
        else {
          this.spinner = false;
          this.alert = saved.includes('SUCCESS') ? Alert[this.language].alertSaved : Alert[this.language].alertError;
          this.createMenuForm.get('title').setValue('');
          this.formView = false;
        }
        this.getMenu();
      }

      setTimeout(() => {
        this.alert = '';
        this.childrenFormAlert = '';
        this.error = false;
      }, 5000);

      setTimeout(() => {
        if (parentData == undefined) {
          this.createMenuForm.reset();
          this.formView = true;
        }
        else {
          this.addMenuForm.reset();
          this.addMenuFormView = 'addMenuFormView' + parentData.id;
          //this.iconControl = -1;
        }

      }, 0);
    });
  }
  getMenu() {
    this.getSetData.getMenu().subscribe(menu => {
      this.menu = menu;
      this.dataSource = new ArrayDataSource(menu);
      //change direction padding of maneu tree
      setTimeout(()=>{
        if (this.language == 'heb') {
          let menuElements = document.querySelectorAll('.example-tree-node .example-tree-node');
          menuElements.forEach(el => {
            (el as HTMLBodyElement).style.paddingRight = '40px';
            (el as HTMLBodyElement).style.paddingLeft = '0px';
          });
        }
      },0);
    });
  }

  openAddMenuForm(data) {
    this.clickedToOpenAddMenuForm = !this.clickedToOpenAddMenuForm;

    //clicked to open form of add child to menu
    if (this.clickedToOpenAddMenuForm) {
      this.idOfSelectedNode = data.id;
      this.iconControl = data.id;
      this.addMenuFormView = 'addMenuFormView' + data.id;
      this.addMenuForm.addControl('title' + data.id, this.fb.control(''));
      setTimeout(() => {
        this.addMenuForm.get('title' + data.id).setValidators(Validators.required);
      }, 0);
    }
    //clicked to close form of add child to menu
    else {
      if (this.idOfSelectedNode == data.id) {
        this.addMenuForm.removeControl('title' + data.id);
        this.addMenuFormView = 'addMenuFormView';
        this.iconControl = -1;
      }
      //clicked to open form of add child to menu but opened form is still opened
      else {
        this.iconControl = data.id;
        this.addMenuForm.removeControl('title' + this.idOfSelectedNode);
        this.addMenuForm.addControl('title' + data.id, this.fb.control(''));
        this.addMenuFormView = 'addMenuFormView' + data.id;

      }
    }
  }
  ngAfterViewInit() { }

  ngOnDestroy() {
    this.languageToUnSub.unsubscribe();
  }
}
