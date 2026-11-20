import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindSitterSearchForm } from './find-sitter-search-form';

describe('FindSitterSearchForm', () => {
  let fixture: ComponentFixture<FindSitterSearchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSitterSearchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FindSitterSearchForm);
    fixture.detectChanges();
  });

  it('marks required fields invalid after an empty submission', () => {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const address: HTMLInputElement = fixture.nativeElement.querySelector('#your-address');
    const service: HTMLSelectElement = fixture.nativeElement.querySelector('#service');
    const petPicker: HTMLButtonElement = fixture.nativeElement.querySelector('.pet-picker-trigger');

    expect(address.classList.contains('ng-invalid')).toBe(true);
    expect(address.classList.contains('ng-touched')).toBe(true);
    expect(service.classList.contains('ng-invalid')).toBe(true);
    expect(petPicker.classList.contains('invalid')).toBe(true);
  });
});
