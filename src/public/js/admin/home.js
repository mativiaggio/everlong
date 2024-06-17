$(document).ready(function () {
  $.ajax({
    url: "/api/admin/users/users_stats",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        const ctx = $("#userStatsChart")[0].getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Usuarios Totales", "Usuarios Admin", "Usuarios Clientes"],
            datasets: [
              {
                label: "Usuarios",
                data: [
                  response.data.totalUsers,
                  response.data.adminUsers,
                  response.data.customerUsers,
                ],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error("Error fetching user stats:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });

  $.ajax({
    url: "/api/admin/products/products_stats",
    method: "GET",
    success: function (response) {
      if (response.status === "success") {
        const ctx = $("#productStatsChart")[0].getContext("2d");
        const categories = response.data.productsByCategory.map(
          (cat) => cat._id
        );
        const counts = response.data.productsByCategory.map((cat) => cat.count);

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Total de Productos"].concat(categories),
            datasets: [
              {
                label: "Productos",
                data: [
                  response.data.totalProducts,
                  // response.data.lowStockProducts,
                ].concat(counts),
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ].concat(
                  Array(categories.length).fill("rgba(153, 102, 255, 0.2)")
                ),
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                ].concat(
                  Array(categories.length).fill("rgba(153, 102, 255, 1)")
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        $("#tbody-low-stock-products").find("td").remove();
        const lowStockProducts = response.data.lowStockProducts;
        $(lowStockProducts).each(function () {
          $("#tbody-low-stock-products").append(`
            <tr class="even:bg-[var(--main-light-1)] even:dark:bg-[var(--main-dark-7)] odd:bg-[var(--main-light-2)] odd:dark:bg-[var(--main-dark-3)] border-b dark:border-[var(--main-dark-10)]">
              <td class="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${this.title}
              </td>
              <td class="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${this.stock}
              </td>
            </tr>
          `);
        });
      } else {
        console.error("Error fetching product stats:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
});
