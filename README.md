# 🧠 Prueba Técnica Kitkaton - PokeAPI (Backend NestJS)

Este proyecto implementa una API REST construida con **NestJS**, **PostgreSQL** y consumo interno de **GraphQL (PokeAPI)**.  
Permite registrar usuarios, autenticarse mediante **JWT**, buscar Pokémon y gestionarlos como favoritos.

---

## 🚀 Despliegue

**Endpoint público (AWS Elastic Beanstalk):**  
👉 [http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com](http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com)

**Swagger Docs:**  
👉 [http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com/docs](http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com/docs)  
🔐 **Basic Auth:**  
Usuario: **admin**  
Contraseña: **kitkaton123**

---

## 🧩 Tecnologías utilizadas

- **Node.js 20**
- **NestJS (TypeScript)**
- **PostgreSQL (AWS RDS)**
- **Prisma ORM**
- **GraphQL interno (PokeAPI v1beta2)**
- **JWT + Passport**
- **Swagger + Basic Auth**
- **ESLint + Prettier**
- **Jest (≥70 % cobertura)**

---

## 📦 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/GreenSoul03/prueba-tecnica-pokeapi-backend.git
cd prueba-tecnica-pokeapi-backend

# Instalar dependencias
npm install

# Variables de entorno (.env)
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/pokeapi?schema=public
JWT_SECRET=GENGAR_SECRET_SUPER_SEGURO
PORT=8080
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=kitkaton123
NODE_ENV=development

# Ejecutar servidor
npm run start:dev

# Pruebas
npm run test
npm run test:cov
```

---

## 📬 Endpoints principales

### 🔐 Autenticación (`/api/v1/auth`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/api/v1/auth/register` | Registrar un nuevo usuario |
| **POST** | `/api/v1/auth/login` | Iniciar sesión y obtener JWT |

### 🧩 Pokémon (`/api/v1/pokemon`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/api/v1/pokemon` | Buscar Pokémon por nombre (consumo interno de GraphQL) |

### ⭐ Favoritos (`/api/v1/favorites`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/api/v1/favorites` | Listar favoritos del usuario autenticado |
| **POST** | `/api/v1/favorites` | Agregar un Pokémon a favoritos |
| **DELETE** | `/api/v1/favorites/:pokemonId` | Eliminar un Pokémon de los favoritos |

---

## 📁 Colección Postman

**Archivo:** `pokeAPI NestJS.postman_collection.json`

Incluye scripts automáticos:
- Guarda el token JWT en `{{jwtToken}}` tras login  
- Usa ese token en las rutas protegidas  
- Valida respuestas con tests Postman  

---

## 🧹 Calidad de código

```bash
# Analizar estilo y errores
npm run lint

# Aplicar formato con Prettier
npm run format
```

---

## 🧠 Consideraciones técnicas

- Los endpoints REST son consumibles públicamente.  
- Las peticiones a la **PokeAPI GraphQL** se realizan de forma **interna**, no se expone el endpoint GraphQL.  
- El token **JWT** se genera con `AuthService` y se valida mediante `JwtAuthGuard`.  
- La documentación **Swagger** está protegida con **Basic Auth**.  

---

## 👨‍💻 Autor

**David Cano**  
💼 Desarrollador Backend — Prueba Técnica Kitkaton  
📧 **davidsantiago03.com@gmail.com**  
🌐 [http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com](http://pokeapi-env.eba-3x7ewjh4.us-east-1.elasticbeanstalk.com)
