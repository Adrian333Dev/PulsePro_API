# NestJS Project Structure

## **Project Structure**

A typical NestJS project structure looks like this:

```sh
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── modules/
│   ├── module-name/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── module-name.module.ts
├── auth/
│   ├── controllers/
│   ├── services/
│   ├── dtos/
│   ├── guards/
│   ├── strategies/
│   ├── interfaces/
│   ├── constants/
│   └── auth.module.ts
├── app.module.ts
├── main.ts
├── utils/
└── shared/
    ├── interfaces/
    └── constants/
```

## **Modules**

Modules help to organize your application into cohesive blocks of functionality.

- **Feature Modules:** Each feature of your application should have its own module. For example, a `users` module, `auth` module, etc.
- **Shared Module:** Contains reusable components, services, and modules used across the application.

## **Common Utilities**

Create a `common` directory for reusable components such as:

- **Decorators:** Custom decorators for your application.
- **Filters:** Global filters for exception handling.
- **Guards:** Custom guards for authentication and authorization.
- **Interceptors:** Custom interceptors for transforming or logging requests/responses.
- **Pipes:** Custom pipes for data validation and transformation.

## **Configuration**

Create a `config` directory for configuration files and services. Use environment variables for configuration settings.

## **Shared Utilities**

Create a `shared` directory for shared interfaces and constants that are used across multiple modules.

## **Utils**

Create a `utils` directory for utility functions and classes that are used across the application.

## Example Structure for a User Module

```sh
src/
├── modules/
│   ├── user/
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── dtos/
│   │   │   └── create-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   └── user.module.ts
```

## **Environment Configuration**

Use the `@nestjs/config` package to manage environment configurations. Create a `config` directory and define your configuration files:

```sh
src/
├── config/
│   ├── configuration.ts
│   └── configuration.module.ts
```
