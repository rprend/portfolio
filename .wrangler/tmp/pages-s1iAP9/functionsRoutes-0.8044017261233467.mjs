import { onRequestDelete as __api___path___ts_onRequestDelete } from "/Users/ryanprendergast/Documents/PortfolioFinalFinal/functions/api/[[path]].ts"
import { onRequestPost as __api___path___ts_onRequestPost } from "/Users/ryanprendergast/Documents/PortfolioFinalFinal/functions/api/[[path]].ts"
import { onRequest as __api___path___ts_onRequest } from "/Users/ryanprendergast/Documents/PortfolioFinalFinal/functions/api/[[path]].ts"

export const routes = [
    {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api___path___ts_onRequestDelete],
    },
  {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api___path___ts_onRequestPost],
    },
  {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___path___ts_onRequest],
    },
  ]