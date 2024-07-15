export function productsCategories(categories) {
  const parentCategories = [];
  const subCategories = [];
  let html = "<ul>";

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
      return `<li><a class="hover:underline" href="/productos/categoria/${category.slug}">${category.name}</a></li>`;
    }

    html += `
        <a class="font-bold hover:underline" href="/productos/categoria/${
          parentCategory.slug
        }">${parentCategory.name}</a>
        <ul class="mb-4 text-[var(--main-light-10)] dark:text-gray-400">
          ${filteredSubCategories.map(categoryItem).join("")}
        </ul>
    `;
  });

  html += "</ul>";

  return html;
}
