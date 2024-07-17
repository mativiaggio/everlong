// import { formatCurrency } from "../../functions.js";
// export function cartItem(product) {
//   return `
//     <div id="product-card-${product._id}"  class="mb-2 border border-[var(--main-light-2)] dark:border-[var(--main-dark-8)] rounded-lg overflow-hidden shadow relative bg-[var(--main-bg-light)] dark:bg-[var(--main-dark-3)]">
//       <div class="p-6 border-b border-[var(--main-light-2)] dark:border-[var(--main-dark-8)]">
//         <h1 class="font-bold">${product.brand || "Everlong"}</h1>
//       </div>
//       <div class="p-6 w-full flex flex-col sm:flex-row justify-between">
//         <div class="flex">
//           <img
//             class="h-[64px] w-[64px] object-cover"
//             src="${product.images[0]}"
//             alt="${product.title}"
//           />
//           <div class="flex flex-col justify-between px-2">
//             <h2 class="font-bold">${product.title}</h2>
//             <div class="border w-fit">
//               <button class="removeOne px-2" data-button="${product._id}">-</button>
//               <span id="quantity-${product._id}">${product.quantity}</span>
//               <button class="addOne px-2" data-button="${product._id}">+</button>
//             </div>
//           </div>
//         </div>
//         <div class="flex flex-row sm:flex-col mt-2 sm:mt-0 items-center">
//           <p class="font-bold mr-2 sm:mr-0">${formatCurrency(product.price)}</p>
//           <p class="text-sm text-center text-[var(--main-light-5)]">Stock: ${product.stock}</p>
//         </div>
//       </div>

//       <button class="deleteButton absolute top-2 right-2" data-button="${product._id}">
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
//       </button>

//     </div>
//    `;
// }

import { formatCurrency } from "../../functions.js";
export function cartItem(product) {
  return `
    <div id="product-card-${product._id}" class="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6 border-b border-gray-200 group relative">
      <div class="w-full md:max-w-[126px]">
        <img src="${product.images[0]}" alt="${product.title}" class="mx-auto">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 w-full">
        <div class="md:col-span-2">
          <div class="flex flex-col max-[500px]:items-center gap-3">
            <h6 class="font-semibold text-base leading-7 text-black">${product.title}</h6>
            <h6 class="font-normal text-base leading-7 text-gray-500">${product.brand || "Everlong"}</h6>
            <h6 class="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-[var(--main-dark-1)]" data-price-unformatted-${product._id}="${product.price}">
              ${formatCurrency(product.price)}
            </h6>
          </div>
        </div>
        <div class="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
          <div class="flex items-center h-full">
            <button class="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300 removeOne" data-button="${product._id}">
              <svg class="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
            <input type="text" class="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px] text-center bg-transparent" id="quantity-${product._id}" value="${product.quantity}">
            <button class="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300 addOne" data-button="${product._id}">
              <svg class="stroke-gray-900 transition-all duration-500 group-hover:stroke-black" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
          <p id="parcialTotal-${product._id}" class="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-[var(--main-dark-1)]">
            ${formatCurrency(product.price * product.quantity)}
          </p>
        </div>
      </div>
     <button class="deleteButton absolute top-2 right-2" data-button="${product._id}">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
     </button>
    </div>
  `;
}
