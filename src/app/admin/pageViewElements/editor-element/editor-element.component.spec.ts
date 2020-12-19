import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorElementComponent } from './editor-element.component';

describe('EditorElementComponent', () => {
  let component: EditorElementComponent;
  let fixture: ComponentFixture<EditorElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
