import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout('./layouts/layout.tsx', [
    index('./routes/home.tsx'),
    route('*', './routes/not-found.tsx'), // Catch-all route
  ]),
] satisfies RouteConfig;
