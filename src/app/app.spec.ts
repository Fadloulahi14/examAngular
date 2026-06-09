import { TestBed } from '@angular/core/testing';
import { FallouBilanJournalierComponent } from './app';

describe('FallouBilanJournalierComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallouBilanJournalierComponent],
    }).compileComponents();
  });

  it('affiche le titr', () => {
    const fallouFixture = TestBed.createComponent(FallouBilanJournalierComponent);
    const fallouComposant = fallouFixture.componentInstance;
    expect(fallouComposant).toBeTruthy();
  });

  it('titre ', async () => {
    const fallouFixture = TestBed.createComponent(FallouBilanJournalierComponent);
    await fallouFixture.whenStable();
    const fallouHTML = fallouFixture.nativeElement as HTMLElement;
    expect(fallouHTML.querySelector('h1')?.textContent).toContain('fit trac');
  });
});
