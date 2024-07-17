// export function cartIsEmpty() {
//   return `
//         <div class="mb-2 border border-[var(--main-light-2)] dark:border-[var(--main-dark-8)] rounded-lg overflow-hidden shadow relative bg-[var(--main-bg-light)] dark:bg-[var(--main-dark-3)] px-6 py-28">
//             <div class="flex flex-col justify-center items-center">
//                 <svg class="mb-4" width="83px" height="83px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

//                 <path fill="#EDEDED" d="M50 0c-27.614 0-50 22.387-50 50 0 27.615 22.386 50 50 50 27.613 0 50-22.385 50-50 0-27.613-22.387-50-50-50z"/>

//                 <path fill="#D07C40" d="M19.004 29.985h62.021v49.976h-61.959l-.062-49.976z"/>

//                 <g fill="#EFC75E">

//                 <path d="M84.003 42.015c0 .025-67.944-.02-68.008 0v37.919c.001.004-.007 2.999-.018 6.693 8.925 8.293 20.878 13.373 34.023 13.373 13.122 0 25.057-5.061 33.977-13.328-.031-3.709-.057-6.723-.055-6.724 0-15.728.081-37.933.081-37.933zM75.021 34.009v6.521l6.004-1.17v-9.375zM25.01 40.023v-6.014l-6.006-4.024v9.984z"/>

//                 </g>

//                 <path fill="#DBA250" d="M25.01 42.015v-8.006l-9.015 8.006h9.015zm50.011-8.006v8.006h8.981l-8.981-8.006z"/>

//                 <path fill="#CBA950" d="M71.064 57.558c0-.838-.724-1.586-1.562-1.586s-1.649.748-1.649 1.586c-.004 10.158-7.641 18.393-17.8 18.393-10.16 0-17.996-8.233-18.001-18.393 0-.838-.71-1.586-1.549-1.586s-1.657.748-1.657 1.586c0 11.936 9.275 21.608 21.209 21.608 11.933 0 21.009-9.674 21.009-21.608z"/>

//                 <path fill="#D07C40" d="M30.472 52.988c-1.37 0-2.48 1.11-2.48 2.48 0 1.369 1.11 2.479 2.48 2.479 1.37 0 2.512-1.11 2.512-2.479-.001-1.368-1.143-2.48-2.512-2.48zm39.001 0c-1.371 0-2.48 1.11-2.48 2.48 0 1.369 1.109 2.479 2.48 2.479 1.369 0 2.512-1.11 2.512-2.479-.003-1.368-1.144-2.48-2.512-2.48z"/>

//                 <path fill="#ffffff" d="M71.064 56.558c0-.838-.724-1.586-1.562-1.586s-1.649.748-1.649 1.586c-.004 10.158-7.641 18.393-17.8 18.393-10.16 0-17.996-8.233-18.001-18.393 0-.838-.71-1.586-1.549-1.586s-1.657.748-1.657 1.586c0 11.936 9.275 21.608 21.209 21.608 11.933 0 21.009-9.674 21.009-21.608z"/>

//                 </svg>
//                 <h1 class="mb-2">Tu carrito está vacío.</h1>
//                 <p class="mb-4">Añade productos a tu carrito para comprar.</p>
//                 <a href="/productos" class="rounded-lg  px-4 py-3 bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)] text-[var(--main-text-dark)] dark:text-[var(--main-text-light)]">
//                     Descubrir productos
//                 </a>
//             </div>
//         </div>
//     `;
// }

export function cartIsEmpty() {
  return `
      <div class="mb-2 border border-[var(--main-light-2)] dark:border-[var(--main-dark-8)] rounded-lg overflow-hidden shadow relative bg-[var(--main-bg-light)] dark:bg-[var(--main-dark-3)] px-6 py-28">
        <div class="flex flex-col justify-center items-center">
          <svg class="mb-4" width="83px" height="83px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EDEDED" d="M50 0c-27.614 0-50 22.387-50 50 0 27.615 22.386 50 50 50 27.613 0 50-22.385 50-50 0-27.613-22.387-50-50-50z"/>
            <path fill="#D07C40" d="M19.004 29.985h62.021v49.976h-61.959l-.062-49.976z"/>
            <g fill="#EFC75E">
              <path d="M84.003 42.015c0 .025-67.944-.02-68.008 0v37.919c.001.004-.007 2.999-.018 6.693 8.925 8.293 20.878 13.373 34.023 13.373 13.122 0 25.057-5.061 33.977-13.328-.031-3.709-.057-6.723-.055-6.724 0-15.728.081-37.933.081-37.933zM75.021 34.009v6.521l6.004-1.17v-9.375zM25.01 40.023v-6.014l-6.006-4.024v9.984z"/>
            </g>
            <path fill="#DBA250" d="M25.01 42.015v-8.006l-9.015 8.006h9.015zm50.011-8.006v8.006h8.981l-8.981-8.006z"/>
            <path fill="#CBA950" d="M71.064 57.558c0-.838-.724-1.586-1.562-1.586s-1.649.748-1.649 1.586c-.004 10.158-7.641 18.393-17.8 18.393-10.16 0-17.996-8.233-18.001-18.393 0-.838-.71-1.586-1.549-1.586s-1.657.748-1.657 1.586c0 11.936 9.275 21.608 21.209 21.608 11.933 0 21.009-9.674 21.009-21.608z"/>
            <path fill="#D07C40" d="M30.472 52.988c-1.37 0-2.48 1.11-2.48 2.48 0 1.369 1.11 2.479 2.48 2.479 1.37 0 2.512-1.11 2.512-2.479-.001-1.368-1.143-2.48-2.512-2.48zm39.001 0c-1.371 0-2.48 1.11-2.48 2.48 0 1.369 1.109 2.479 2.48 2.479 1.369 0 2.512-1.11 2.512-2.479-.003-1.368-1.144-2.48-2.512-2.48z"/>
            <path fill="#ffffff" d="M71.064 56.558c0-.838-.724-1.586-1.562-1.586s-1.649.748-1.649 1.586c-.004 10.158-7.641 18.393-17.8 18.393-10.16 0-17.996-8.233-18.001-18.393 0-.838-.71-1.586-1.549-1.586s-1.657.748-1.657 1.586c0 11.936 9.275 21.608 21.209 21.608 11.933 0 21.009-9.674 21.009-21.608z"/>
          </svg>
          <h1 class="mb-2">Tu carrito está vacío.</h1>
          <p class="mb-4">Añade productos a tu carrito para comprar.</p>
          <a href="/productos" class="rounded-lg px-4 py-3 bg-[var(--main-bg-dark)] dark:bg-[var(--main-bg-light)] text-[var(--main-text-dark)] dark:text-[var(--main-text-light)]">
            Descubrir productos
          </a>
        </div>
      </div>
    `;
}
