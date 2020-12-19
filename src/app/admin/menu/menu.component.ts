import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { LanguageService } from '../../services/languages/languages.service';
import { FormTitles } from '../../classes-const/menuFormTitles';
import { GetSetDataService } from '../../services/getSetData/get-set-data.service';
import { Menu } from '../../classes-const/menuClass';
import { Alert } from '../../classes-const/alerts';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { GlobalSettings } from 'src/app/classes-const/globalSettings';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private fb: FormBuilder, 
    private getSetData: GetSetDataService,
    private languageService: LanguageService) { }

  @Input() settings;
  addMenuTooltip: string;
  createMenuTitle: string;
  createMenuButton: string;
  titleInputAddMenu: string;

  clickedToCreateMenu: boolean = false;
  clickedToOpenAddMenuForm: boolean = false;

  idOfSelectedNode: number = -1;
  openFormButton: string = 'keyboard_arrow_down';

  //language: string;
  //languageToUnSub;
  //direction: string;
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
    this.getMenu();
    this.configuration();
    this.getLanguageIfChange();
  }

  configuration() {
    this.configTitles(this.settings);

    let menuElements = document.querySelectorAll('.createMainMenu');
    menuElements.forEach((el, index) => {
      (el as HTMLBodyElement).style.textAlign = this.settings['direction'] == 'rtl' ? 'right' : 'left';
      (el as HTMLBodyElement).dir = this.settings['direction'];
    });

    document.querySelectorAll('cdk-tree').forEach(el => {
      (el as HTMLBodyElement).style.textAlign = this.settings['direction'] == 'rtl' ? 'right' : 'left';
    });
    document.querySelectorAll('cdk-nested-tree-node > div > cdk-nested-tree-node').forEach(el => {
      (el as HTMLBodyElement).style.paddingRight = this.settings['direction'] == 'rtl' ? '40px' : '0px';
      (el as HTMLBodyElement).style.paddingLeft = this.settings['direction'] == 'rtl' ? '0px' : '40px';
    });
  }
  configTitles(settings: GlobalSettings){
    this.addMenuTooltip = FormTitles[settings['language']].tooltipAddMenu;
    this.createMenuTitle = FormTitles[settings['language']].titleFormAddMenu;
    this.createMenuButton = FormTitles[settings['language']].buttonSaveAddMenu;
    this.titleInputAddMenu = FormTitles[settings['language']].titleInputAddMenu;
    this.closeMenuTooltip = FormTitles[settings['language']].tooltipCloseMenu;
  }
  getLanguageIfChange() {
    this.getSetData.settings.subscribe(settings => {
      this.settings = settings;
          this.configuration();
        });
  }
  openCreateMenu() {
    this.clickedToCreateMenu = !this.clickedToCreateMenu;
    this.openFormButton = this.clickedToCreateMenu ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  saveNewMenu(menuName, parentData?) {
    debugger
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
        // this.getSetData.settings.subscribe(settings => {
          if (parentData != undefined) {
            this.spinnerChild = false;
            this.childrenFormAlert = saved.includes('SUCCESS') ? Alert[this.settings['language']].alertSaved : Alert[this.settings['language']].alertError;
            // this.addMenuForm.get('title' + parentData.id).setValue('');
            // this.addMenuFormView = 'addMenuFormView';
          }
          else {
            this.spinner = false;
            this.alert = saved.includes('SUCCESS') ? Alert[this.settings['language']].alertSaved : Alert[this.settings['language']].alertError;
            this.createMenuForm.get('title').setValue('');
            this.formView = false;
          }
        // });
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
      setTimeout(() => {
        this.configuration();
      }, 0);
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
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    //this.languageToUnSub.unsubscribe();
  }
}
