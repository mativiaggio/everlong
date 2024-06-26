$("#usersSearchDropdown").dropdown({
  title: "Nombre",
  items: [
    {
      title: "Nombre",
      id: "full_name",
    },
    {
      title: "Email",
      id: "email",
    },
  ],
  defaultSearch: "full_name",
});

function searchUser() {
  const findBy = $("#usersSearchDropdown").attr("findBy");
  const query = $("#searchInput").val();

  fetch(`/api/admin/users/search?findBy=${findBy}&query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("users_tbody");
      tbody.innerHTML = "";

      data.users.forEach((user) => {
        const row = document.createElement("tr");
        row.className =
          "even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)] cursor-pointer";
        row.id = user.slug;
        row.innerHTML = `
          <td scope="row" class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">${
            user.full_name
          }</td>
          <td class="px-2 py-2">${user.email || ""}</td>
          <td class="px-2 py-2">${user.roles || ""}</td>
        `;
        tbody.appendChild(row);
        $("#searchButton").prop("disabled", false);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      $("#searchButton").prop("disabled", false);
    });
}
$("#searchButton").on("click", function (e) {
  e.preventDefault();
  $(this).prop("disabled", true);
  searchUser();
});

$("table").contextMenuPlugin({
  menuSelector: "#contextMenu",
});
