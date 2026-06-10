import { Pipe, PipeTransform } from "@angular/core";
import { formatCurrency, formatDiscount } from "../core/currency.utils";

@Pipe({ name: "brlCurrency", standalone: true })
export class BrlCurrencyPipe implements PipeTransform {
  transform(value: unknown): string {
    return formatCurrency(value);
  }
}

@Pipe({ name: "discountLabel", standalone: true })
export class DiscountLabelPipe implements PipeTransform {
  transform(value: unknown): string {
    return formatDiscount(value);
  }
}
