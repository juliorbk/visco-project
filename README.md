# Visco Orinoco — Frontend (React + TypeScript + Tailwind)

## Prerrequisitos

- Node.js 18+
- Backend corriendo en `http://localhost:8080`
- npm o pnpm

## Setup

```bash
# 1. Copia el contenido de este directorio a tu proyecto Vite existente
#    (o crea uno nuevo: npm create vite@latest visco-app -- --template react-ts)

# 2. Instala dependencias
npm install axios react-router-dom

# 3. Asegúrate de tener Tailwind CSS configurado (ya incluido en tu proyecto)

# 4. Corre el dev server
npm run dev
```

## Estructura de archivos a copiar

```
src/
├── api/
│   ├── client.ts          ← Axios instance + interceptors
│   ├── auth.ts            ← login, register
│   ├── products.ts        ← CRUD productos
│   └── procurement.ts     ← órdenes, aprobación, recepción
├── components/
│   ├── Layout.tsx         ← Sidebar + Header + Outlet
│   ├── Modal.tsx          ← Modal reutilizable con portal
│   ├── ProtectedRoute.tsx ← Wrapper de rutas privadas
│   ├── ProductForm.tsx    ← Formulario crear/editar producto
│   ├── PurchaseOrderForm.tsx   ← Formulario nueva orden
│   └── ReceiveGoodsModal.tsx   ← Modal recepción de mercancía
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   └── PurchaseOrdersPage.tsx
├── types/
│   └── index.ts           ← Todos los DTOs e interfaces
├── utils/
│   └── labels.ts          ← Mapas de etiquetas en español para enums
└── App.tsx                ← Routing con react-router-dom v6
```

## Flujo de autenticación

1. Usuario accede a `/login`
2. Al hacer login exitoso, el token JWT se guarda en `localStorage` (`visco_token`) y el objeto usuario en `visco_user`
3. El axios client adjunta automáticamente el token en cada petición
4. Si el backend responde 401, el interceptor limpia el storage y redirige a `/login`
5. `ProtectedRoute` verifica la existencia del token antes de renderizar rutas privadas

## Notas de integración

- **Suppliers y Categories**: Los selects de `ProductForm` y `PurchaseOrderForm` intentan cargar `/api/suppliers` y `/api/categories`. Si esos endpoints aún no existen en tu backend, caen en un fallback demo para no romper la UI.
- **Paginación**: `ProductsPage` usa `page` y `size` como query params. Si tu API devuelve array plano en vez de `Page<T>`, el código lo maneja con fallback.
- **Enums en español**: Ver `src/utils/labels.ts` para todas las traducciones.
