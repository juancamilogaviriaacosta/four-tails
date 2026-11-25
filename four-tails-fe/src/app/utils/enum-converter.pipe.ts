import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumConverter',
  standalone: true,
})
export class EnumConverterPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
