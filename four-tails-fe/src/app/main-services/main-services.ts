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
      eyebrow: 'PET SITTING',
      title: 'Care that feels like home.',
      description: 'Find a trusted sitter who will care for your pet like family.',
      action: 'Find a sitter',
      href: '#find',
      image: 'fs1.png',
      alt: 'Perro con su cuidadora',
    },
    {
      eyebrow: 'PET MARKET',
      title: 'All in one place.',
      description: 'Discover everyday essentials for happier, healthier pets.',
      action: 'Explore the market',
      href: '#market',
      image: 'pm1.png',
      alt: 'Productos para mascotas',
    },
    {
      eyebrow: 'JOIN OUR COMMUNITY',
      title: 'Caring will make your day.',
      description: 'Turn your love for animals into meaningful work.',
      action: 'Become a sitter',
      href: '#sitter',
      image: 'bs1.png',
      alt: 'Cuidador disfrutando del tiempo con un perro',
    },
  ];

  currentSlide = 0;
  private autoplayTimer?: ReturnType<typeof setInterval>;
  private touchStartX: number | null = null;

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

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches.item(0)?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches.item(0);
    if (!touch || this.touchStartX === null) {
      return;
    }

    const distance = touch.clientX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance < 0) {
      this.nextSlide();
    } else {
      this.previousSlide();
    }
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

  navigateToFindSitter(): void {
    this.router.navigate(['/find-sitter']);
  }
}
