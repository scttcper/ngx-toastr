import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonService, MdoButtonModule } from '@ctrl/ngx-github-buttons';
import { of as ObservableOf } from 'rxjs';

import { HeaderComponent } from './header.component';

class FakeButtonService {
  repo(user: string, repo: string) {
    return ObservableOf({ stargazers_count: 0 });
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdoButtonModule],
      declarations: [HeaderComponent],
      providers: [{ provide: ButtonService, useClass: FakeButtonService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
