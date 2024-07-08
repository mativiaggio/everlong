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
        <div>
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
                
            </div>
        </div>
    `;
}
