// export function productsCategories(categories) {
//   const parentCategories = [];
//   const subCategories = [];
//   let html = "<ul>";

//   categories.forEach((category) => {
//     if (!category.parent || category.parent === "") {
//       parentCategories.push(category);
//     } else {
//       subCategories.push(category);
//     }
//   });

//   parentCategories.forEach((parentCategory) => {
//     let filteredSubCategories = [];

//     subCategories.forEach((subCategory) => {
//       if (subCategory.parent.toString() === parentCategory._id.toString()) {
//         filteredSubCategories.push(subCategory);
//       }
//     });

//     function categoryItem(category) {
//       return `<li><a class="hover:underline" href="/productos/categoria/${category.slug}">${category.name}</a></li>`;
//     }

//     html += `
//         <a class="font-bold hover:underline" href="/productos/categoria/${
//           parentCategory.slug
//         }">${parentCategory.name}</a>
//         <ul class="mb-4 text-[var(--main-light-10)] dark:text-gray-400">
//           ${filteredSubCategories.map(categoryItem).join("")}
//         </ul>
//     `;
//   });

//   html += "</ul>";

//   return html;
// }

export function productsCategories(categories) {
  const parentCategories = [];
  const subCategories = [];
  let html = "";

  categories.forEach((category) => {
    if (!category.parent || category.parent === "") {
      parentCategories.push(category);
    } else {
      subCategories.push(category);
    }
  });

  parentCategories.forEach((parentCategory) => {
    let filteredSubCategories = [];

    subCategories.forEach((subCategory) => {
      if (subCategory.parent.toString() === parentCategory._id.toString()) {
        filteredSubCategories.push(subCategory);
      }
    });

    function categoryItem(category) {
      return `
        <a href="/productos/categoria/${category.slug}">
          <li class="relative select-none py-2 pl-3 pr-9 text-gray-900 hover:!bg-[#f9fafb] cursor-pointer" role="option" category-slug="${category.slug}">
            <div class="flex items-center">
              <span class="ml-3 block truncate font-normal">${category.name}</span>
            </div>
          </li>
        </a>
      `;
    }

    html += `
      <a href="/productos/categoria/${parentCategory.slug}">
        <li class="relative select-none py-2 pl-3 pr-9 text-gray-900 hover:!bg-[#f9fafb] cursor-pointer" role="option" category-slug="${parentCategory.slug}">
          <div class="flex items-center">
            <span class="ml-3 block truncate font-bold">${parentCategory.name}</span>
          </div>
        </li>
      </a>
      ${filteredSubCategories.map(categoryItem).join("")}
      <hr>
    `;
  });

  return html;
}

{
  /* <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd" />
            </svg>
          </span>
<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd" />
          </svg>
        </span> */
}
