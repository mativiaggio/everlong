// handlebarsConfig.js
import exphbs from "express-handlebars";
import { getPath } from "../utils/functions.js";

const hbs = exphbs.create({
  helpers: {
    renderRoles: function (roles) {
      const roleBgColors = {
        admin: "bg-red-300",
        empleado: "bg-emerald-300",
        user: "bg-indigo-200",
      };

      const roleColors = {
        admin: "text-red-800",
        empleado: "text-emerald-800",
        user: "text-indigo-800",
      };

      return roles
        .map((role) => {
          const user_role = role.toUpperCase();
          const bgColorClass = roleBgColors[role] || "bg-gray-300";
          const colorClass = roleColors[role] || "text-gray-900";
          return `<span class="${bgColorClass} ${colorClass} text-xs font-semibold me-2 px-2.5 py-0.5 rounded-full">${user_role}</span>`;
        })
        .join("");
    },
    eq: function (a, b) {
      return a === b;
    },
    formatDate: function (date) {
      const formattedDate = new Date(date).toLocaleDateString("es-ES");
      return formattedDate;
    },
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
  defaultLayout: "main",
  layoutsDir: getPath("views/layouts"),
  partialsDir: getPath("views/partials"),
});

export default hbs;
