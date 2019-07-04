import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualmirrorPage } from './virtualmirror.page';

describe('VirtualmirrorPage', () => {
  let component: VirtualmirrorPage;
  let fixture: ComponentFixture<VirtualmirrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualmirrorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualmirrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
