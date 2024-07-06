export function productsCategories(categories) {
  console.log(categories);
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
      //   console.log("parent: " + subCategory.parent);
      //   console.log("parent id: " + parentCategory._id);

      if (subCategory.parent == parentCategory._id) {
        console.log("sub category: " + subCategory);
        filteredSubCategories.push(subCategory);
      }
    });

    console.log(
      "Categorias filtradas: " + JSON.stringify(filteredSubCategories)
    );
  });

  return html;
}
