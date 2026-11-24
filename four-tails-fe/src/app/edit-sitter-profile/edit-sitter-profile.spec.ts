import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSitterProfile } from './edit-sitter-profile';

describe('EditSitterProfile', () => {
  let component: EditSitterProfile;
  let fixture: ComponentFixture<EditSitterProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSitterProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSitterProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
