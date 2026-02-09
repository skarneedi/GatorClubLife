import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverEffects = false;

  get classes(): string {
    const base = 'bg-surface rounded-2xl shadow-sm border border-border-light overflow-hidden block h-full';

    // Tailwind paddings
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hover = this.hoverEffects ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

    return `${base} ${paddings[this.padding]} ${hover}`;
  }
}
