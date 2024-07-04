import { formatCurrency } from "../../functions.js";

export function cartTotal(cart) {
  let q = 0;
  let envio = 0;
  let total = 0;
  let finalPrice = 0;

  if (cart) {
    q = cart.products.length;
    total = cart.total;
    envio = q > 0 ? 5000 : 0;
    finalPrice = total + envio;
  }

  const flag = finalPrice === 0;
  const disabled = flag ? "cursor-not-allowed" : "cursor-pointer";

  return `
        <div class="mb-2 border border-[var(--main-light-2)] dark:border-[var(--main-dark-8)] rounded-lg overflow-hidden shadow relative bg-[var(--main-bg-light)] dark:bg-[var(--main-dark-3)]">
            <div class="p-6 border-b border-[var(--main-light-2)] dark:border-[var(--main-dark-8)]">
                <h1 class="font-bold">Resumen de compra</h1>
            </div>
            <div class="w-full flex justify-between p-6 border-b border-[var(--main-light-2)] dark:border-[var(--main-dark-8)]">
                <div class="flex flex-col">
                    <p>Productos (${q})</p>
                    <p>Envío</p>
                </div>
                <div class="flex flex-col">
                    <p class="text-right">${formatCurrency(total)}</p>
                    <p class="text-right">${formatCurrency(envio)}</p>
                </div>
            </div>
            <div class="w-full flex justify-between p-6">
                <div class="flex flex-col">
                    <p>Total</p>
                </div>
                <div class="flex flex-col">
                    <p class="text-right">${formatCurrency(finalPrice)}</p>
                </div>
            </div>
            <div class="w-full px-6 pb-6">
                <button class="w-full rounded-lg  p-2 bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)] text-[var(--main-text-dark)] dark:text-[var(--main-text-light)] ${disabled}" disabled="${flag}">
                    Continuar compra
                </button>
            </div>
        </div>
    `;
}
