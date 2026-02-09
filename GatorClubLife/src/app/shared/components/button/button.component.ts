import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;

  get classes(): string {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-secondary text-white hover:bg-secondary-light focus:ring-secondary',
      outline: 'border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const width = this.fullWidth ? 'w-full' : '';

    return `${base} ${variants[this.variant]} ${sizes[this.size]} ${width}`;
  }
}
