fetch("https://apis.datos.gob.ar/georef/api/provincias")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener las provincias");
    }
    return response.json();
  })
  .then((data) => {
    $("#select-province-input-3").html('<option value="">Seleccione una provincia</option>');
    const provincias = data.provincias;

    provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    provincias.forEach((provincia) => {
      $("#select-province-input-3").append(`<option value="${provincia.id}">${provincia.nombre}</option>`);
    });

    buildMunicipios();
  })
  .catch((error) => {
    console.error("Error al obtener las provincias:", error);
  });

function buildMunicipios() {
  let provinciaId = $("#select-province-input-3").val();

  if (!provinciaId) {
    $("#select-city-input-3").html('<option value="">Seleccione una localidad</option>');
    return;
  }

  fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&max=1000`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los municipios");
      }
      return response.json();
    })
    .then((data) => {
      $("#select-city-input-3").html('<option value="">Seleccione una localidad</option>');

      let municipios = data.municipios;

      municipios.sort((a, b) => a.nombre.localeCompare(b.nombre));

      municipios.forEach((municipio) => {
        $("#select-city-input-3").append(`<option value="${municipio.nombre}">${municipio.nombre}</option>`);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los municipios:", error);
    });
}

$("#select-province-input-3").on("change", function () {
  buildMunicipios();
});

$("#whatsapp-payment").show();
$("#mercado-pago-payment").hide();
$("#wallet_container").html("");
$("#mercado-pago-spinner-container").removeClass("hidden").addClass("flex");

$('input[name="payment-method"]').on("click", async function () {
  if (this.id === "whatsapp") {
    $("#whatsapp-payment").show();
    $("#mercado-pago-payment").hide();
    $("#wallet_container").html("");
    $("#mercado-pago-spinner").show();
  } else if (this.id === "mercado-pago") {
    console.log("Opción de Mercado Pago seleccionada");
    $("#whatsapp-payment").hide();
    $("#mercado-pago-payment").show();
    // Mercado Pago:
    const mp = new MercadoPago("TEST-fcac8a22-0e63-490d-9ac5-7692b874331c", { locale: "es-AR" });
    try {
      const orderData = {
        title: "Producto Prueba",
        quantity: 1,
        price: 100,
      };

      const response = await fetch("/api/client/payments/generate_payment", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const preference = await response.json();
      createCheckoutButton(preference.id);
    } catch (err) {
      console.log("Error procesando el pago: " + err);
    }

    function createCheckoutButton(preferenceId) {
      const bricksBiulder = mp.bricks();

      const renderComponent = async () => {
        if (window.checkoutButton) window.checkoutButton.unmount();

        await bricksBiulder.create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceId,
          },
        });

        $("#mercado-pago-spinner").hide();
      };

      renderComponent();
    }
  }
});
