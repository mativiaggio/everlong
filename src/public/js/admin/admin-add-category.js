const addPropertyButton = document.getElementById("add-property-button");
const propertiesContainer = document.getElementById("properties-container");

addPropertyButton.addEventListener("click", () => {
  const propertyDiv = document.createElement("div");
  propertyDiv.className =
    "property-item grid gap-4 sm:grid-cols-2 sm:gap-6 mt-4";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "property-name";
  nameInput.placeholder = "Nombre de la propiedad";
  nameInput.className =
    "bg-[var(--main-light-1)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";

  const valuesInput = document.createElement("input");
  valuesInput.type = "text";
  valuesInput.name = "property-values";
  valuesInput.placeholder = "Valores (separados por comas)";
  valuesInput.className =
    "bg-[var(--main-light-1)] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";

  propertyDiv.appendChild(nameInput);
  propertyDiv.appendChild(valuesInput);

  propertiesContainer.appendChild(propertyDiv);
});

const categoryForm = document.getElementById("category-form");
categoryForm.addEventListener("submit", (event) => {
  const properties = [];
  document.querySelectorAll(".property-item").forEach((item) => {
    const name = item.querySelector('input[name="property-name"]').value;
    const values = item
      .querySelector('input[name="property-values"]')
      .value.split(",");
    properties.push({ name, values });
  });

  const hiddenPropertiesInput = document.createElement("input");
  hiddenPropertiesInput.type = "hidden";
  hiddenPropertiesInput.name = "properties";
  hiddenPropertiesInput.value = JSON.stringify(properties);
  categoryForm.appendChild(hiddenPropertiesInput);
});
