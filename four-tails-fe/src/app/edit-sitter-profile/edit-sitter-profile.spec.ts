import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EditSitterProfile } from './edit-sitter-profile';

describe('EditSitterProfile', () => {
  let component: EditSitterProfile;
  let fixture: ComponentFixture<EditSitterProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSitterProfile],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                preload: {
                  staticData: { services: [{ id: 1, name: 'Dog walking' }] },
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSitterProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads services from resolved static data', () => {
    expect(component.services).toEqual([
      { id: 1, name: 'Dog walking', amount: null, active: false },
    ]);
  });
});
