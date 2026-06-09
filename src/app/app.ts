import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';

type TypeActivite = 'SPORT' | 'HYDRATATION';

interface Activite {
  id: number;
  nom: string;
  type: TypeActivite;
  valeur: number;
  dateCreation: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class FallouBilanJournalierComponent {
  private readonly fallouCleStockage = 'fit tract pro';
  private readonly fallouIdentifiantPlateforme = inject(PLATFORM_ID);
  private readonly fallouNavigateur = isPlatformBrowser(this.fallouIdentifiantPlateforme);
  private fallouProchainIdentifiant = 1;

  protected readonly fallouNomActivite = signal('');
  protected readonly fallouTypeActivite = signal<TypeActivite>('SPORT');
  protected readonly fallouValeurActivite = signal<number | null>(null);
  protected readonly fallouActivites = signal<Activite[]>([]);

  protected readonly fallouTotalCalories = computed(() =>
    this.fallouActivites()
      .filter((fallouActivite) => fallouActivite.type === 'SPORT')
      .reduce((fallouTotal, fallouActivite) => fallouTotal + fallouActivite.valeur, 0),
  );

  protected readonly fallouTotalEau = computed(() =>
    this.fallouActivites()
      .filter((fallouActivite) => fallouActivite.type === 'HYDRATATION')
      .reduce((fallouTotal, fallouActivite) => fallouTotal + fallouActivite.valeur, 0),
  );

  protected readonly fallouCaloriesRestantes = computed(() => 2000 - this.fallouTotalCalories());

  protected readonly fallouMessageSante = computed(() => {
    if (this.fallouTotalEau() < 1500) {
      return 'danger d desydrata ';
    }

    if (this.fallouTotalEau() >= 1500 && this.fallouTotalCalories() > 500) {
      return 'Objectif Atteint';
    }

    return '';
  });

  constructor() {
    if (this.fallouNavigateur) {
      const fallouDonneesStockees = localStorage.getItem(this.fallouCleStockage);

      if (fallouDonneesStockees) {
        try {
          const fallouActivitesParsees = JSON.parse(fallouDonneesStockees) as Activite[];
          const fallouListeActivites = Array.isArray(fallouActivitesParsees) ? fallouActivitesParsees : [];
          this.fallouActivites.set(fallouListeActivites);
          this.fallouProchainIdentifiant =
            fallouListeActivites.reduce((fallouMax, fallouActivite) => Math.max(fallouMax, fallouActivite.id), 0) + 1;
        } catch {
          this.fallouActivites.set([]);
        }
      }
    }

    effect(() => {
      if (!this.fallouNavigateur) {
        return;
      }

      localStorage.setItem(this.fallouCleStockage, JSON.stringify(this.fallouActivites()));
    });
  }

  protected fallouAjouterActivite(): void {
    const fallouNom = this.fallouNomActivite().trim();
    const fallouValeur = this.fallouValeurActivite();

    if (!fallouNom || fallouValeur === null || Number.isNaN(fallouValeur) || fallouValeur <= 0) {
      return;
    }

    const fallouNouvelleActivite: Activite = {
      id: this.fallouProchainIdentifiant++,
      nom: fallouNom,
      type: this.fallouTypeActivite(),
      valeur: fallouValeur,
      dateCreation: Date.now(),
    };

    this.fallouActivites.update((fallouCourant) => [...fallouCourant, fallouNouvelleActivite]);
    this.fallouNomActivite.set('');
    this.fallouTypeActivite.set('SPORT');
    this.fallouValeurActivite.set(null);
  }

  protected fallouMettreNomActivite(value: string): void {
    this.fallouNomActivite.set(value);
  }

  protected fallouMettreTypeActivite(value: TypeActivite | string): void {
    this.fallouTypeActivite.set(value === 'HYDRATATION' ? 'HYDRATATION' : 'SPORT');
  }

  protected fallouMettreValeurActivite(value: string | number | null): void {
    if (value === '' || value === null) {
      this.fallouValeurActivite.set(null);
      return;
    }

    const fallouValeurNumerique = typeof value === 'number' ? value : Number(value);
    this.fallouValeurActivite.set(Number.isNaN(fallouValeurNumerique) ? null : fallouValeurNumerique);
  }
}
