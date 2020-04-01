import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VirtualmirrorPage } from './virtualmirror.page';

describe('VirtualmirrorPage', () => {
  let component: VirtualmirrorPage;
  let fixture: ComponentFixture<VirtualmirrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualmirrorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VirtualmirrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
