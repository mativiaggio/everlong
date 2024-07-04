import { formatCurrency } from "../../functions.js";
export function cartItem(product) {
  return `
    <div id="product-card-${product._id}"  class="mb-2 border border-[var(--main-light-2)] dark:border-[var(--main-dark-8)] rounded-lg overflow-hidden shadow relative bg-[var(--main-bg-light)] dark:bg-[var(--main-dark-3)]">
      <div class="p-6 border-b border-[var(--main-light-2)] dark:border-[var(--main-dark-8)]">
        <h1 class="font-bold">${product.brand || "Everlong"}</h1>
      </div>
      <div class="p-6 w-full flex flex-col sm:flex-row justify-between">
        <div class="flex">
          <img
            class="h-[64px] w-[64px] object-cover"
            src="${product.images[0]}" 
            alt="${product.title}"
          />
          <div class="flex flex-col justify-between px-2">
            <h2 class="font-bold">${product.title}</h2>
            <div class="border w-fit">
              <button class="removeOne px-2" data-button="${product._id}">-</button>
              <span id="quantity-${product._id}">${product.quantity}</span>
              <button class="addOne px-2" data-button="${product._id}">+</button>
            </div>
          </div>
        </div>
        <div class="flex flex-row sm:flex-col mt-2 sm:mt-0 items-center">
          <p class="font-bold mr-2 sm:mr-0">${formatCurrency(product.price)}</p>
          <p class="text-sm text-center text-[var(--main-light-5)]">Stock: ${product.stock}</p>
        </div>
      </div>

      <button class="deleteButton absolute top-2 right-2" data-button="${product._id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
      
    </div>
   `;
}
