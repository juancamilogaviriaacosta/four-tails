import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-services',
  imports: [],
  templateUrl: './main-services.html',
  styleUrl: './main-services.css',
})
export class MainServices implements OnInit, OnDestroy {
  readonly slides = [
    {
      icon: '🐾',
      title: 'Premium dog and cat food for $25',
      image: 'https://img.magnific.com/foto-gratis/accesorios-mascotas-concepto-naturaleza-muerta-bola-masticar_23-2148949602.jpg',
      alt: 'Perro alegre jugando',
      action: 'Shop food',
      href: '#market',
    },
    {
      icon: '📅',
      title: 'Save 30% on your first booking',
      image: 'https://img.magnific.com/foto-gratis/concepto-organizacion-tiempo-vista-superior-calendario_23-2149046738.jpg',
      alt: 'Calendario para planificar una reserva',
      action: 'Book now',
      href: '#find',
    },
    {
      icon: '🛡️',
      title: 'Insure one dog, cover the second free',
      image: 'https://img.magnific.com/foto-gratis/lindo-perrito-regreso-escuela_23-2148985925.jpg',
      alt: 'Promoción de temporada',
      action: 'Explore insurance',
      href: '#market',
    },
  ];

  currentSlide = 0;
  private autoplayTimer?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.resumeAutoplay();
  }

  ngOnDestroy(): void {
    this.pauseAutoplay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  selectSlide(index: number): void {
    this.currentSlide = index;
  }

  pauseAutoplay(): void {
    if (this.autoplayTimer !== undefined) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  resumeAutoplay(): void {
    if (this.autoplayTimer === undefined) {
      this.autoplayTimer = setInterval(() => this.nextSlide(), 6000);
    }
  }

  navigateToFindSitter() {
    this.router.navigate(['/find-sitter']);
  }

  navigateToBecomeSitter() {
    this.router.navigate(['/become-sitter']);
  }
}