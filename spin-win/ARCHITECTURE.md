# Spin Win Documentation

The Spin Win API is divided into several modules: 
- **Bank** module
- **Player** module
- **Slot** module
- **Spin** module
- **Leaderboard** module.

All these modules implement the [Hexagonal Architecture](https://medium.com/the-software-architecture-chronicles/ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together-f2590c0aa7f6), also known as Ports and Adapters Architecture, designed by [Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/). As of now, the Bank and Player modules are implemented, and the other modules are under development.

## Project Structure and Development Focus

Here is the current layout of the project's file structure:

```shell
spin-win (workspace)
  ├── apps
  │ ├── slot-machine
  │ ├── slot-machine-api
  ├── libs
  │ ├── db-models
  │ ├── domain
  │ └── infrastructure
```

Please note that the Angular application `slot-machine` is currently under development. The current focus is on the API component `slot-machine-api`, as well as the projects under the `libs` directory. These libraries include `db-models`, `domain`, and `infrastructure` which encapsulate the core functionalities and business logic of the Spin Win game.



## Hexagonal Architecture

Hexagonal Architecture segregates a software application into several loosely-coupled interchangeable components, known as Ports and Adapters. This architectural pattern allows the core application/business logic to be isolated from any technology-based logic, like database queries or user interface interactions.

The main goal of this architecture is to allow an application to be driven by users, programs, automated tests, or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases.

### Ports

Ports are the entry and exit points to your application. Ports are divided into two types:

1. **Primary or Driving Ports**: The interfaces the application exposes.
2. **Secondary or Driven Ports**: The interfaces the application implements.

### Adapters

Adapters adapt the technology-specific input/output to the ports:

- **Primary Adapters**: Drive the application, such as Controllers or CLI commands.
- **Secondary Adapters**: Driven by the application, like Database gateways or Web Services.

## Bank Module

### Ports

- **Primary (Driving) Ports**
    - `ICommandHandler<CreateBankCommand>`: Handles the creation of a bank.
    - `ICommandHandler<DeleteBankCommand>`: Handles the deletion of a bank.
    - `ICommandHandler<DepositMoneyCommand>`: Handles depositing money to a bank.
    - `ICommandHandler<WithdrawMoneyCommand>`: Handles withdrawing money from a bank.
    - `IQueryHandler<GetAllBanksQuery>`, `IQueryHandler<GetBankByIdQuery>`: Used to fetch information about banks.
    - `IEventHandler<BankDepositedMoneyEvent>`, `IEventHandler<BankWithdrewMoneyEvent>`: Handles the event of a bank depositing or withdrawing money.

- **Secondary (Driven) Ports**
    - `IRepository<BankAggregate>`, `IRepository<ReadBankDto>`: Interfaces that interact with the underlying bank data.

### Adapters

- **Primary Adapters**
    - `BankController`: Adapts HTTP requests and routes them to the appropriate use-case in the application.

- **Secondary Adapters**
    - `BankWriteRepository` and `BankReadRepository`: Implement the `IRepository` interface and adapt the methods to interact with the underlying data source.
    - `CreateBankHandler`, `DeleteBankHandler`, `DepositMoneyHandler`, `WithdrawMoneyHandler`: Adapt commands to the bank domain service.
    - `GetAllBanksHandler`, `GetBankByIdHandler`: Adapt queries to the bank domain service.
    - `MoneyDepositedHandler`, `MoneyWithdrewHandler`: Adapts the handling of the event of a bank depositing or withdrawing money.

## Player Module

### Ports

- **Primary (Driving) Ports**
    - `ICommandHandler<CreatePlayerCommand>`: Handles the creation of a player.
    - `ICommandHandler<DeletePlayerCommand>`: Handles the deletion of a player.
    - `ICommandHandler<DepositMoneyCommand>`: Handles depositing money to a player.
    - `IQueryHandler<GetAllPlayersQuery>`, `IQueryHandler<GetPlayerByIdQuery>`: Used to fetch information about players.
    - `IEventHandler<PlayerDepositedMoneyEvent>`: Handles the event of a player depositing money.

- **Secondary (Driven) Ports**
    - `IRepository<PlayerAggregate>`, `IRepository<ReadPlayerDto>`: Interfaces that interact with the underlying player data.

### Adapters

- **Primary Adapters**
    - `PlayerController`: Adapts HTTP requests and routes them to the appropriate use-case in the application.

- **Secondary Adapters**
    - `PlayerWriteRepository` and `PlayerReadRepository`: Implement the `IRepository` interface and adapt the methods to interact with the underlying data source.
    - `CreatePlayerHandler`, `DeletePlayerHandler`, `DepositMoneyHandler`: Adapt commands to the player domain service.
    - `GetAllPlayersHandler`, `GetPlayerByIdHandler`: Adapt queries to the player domain service.
    - `MoneyDepositedHandler`: Adapts the handling of the event of a player depositing money.

## Slot, Spin, and Leaderboard Modules

The Slot, Spin, and Leaderboard modules are currently under development and will implement their respective ports and adapters, including controllers, services, handlers, and more, to encapsulate the necessary business logic. Each will follow the Hexagonal Architecture principles as with the Bank and Player modules.

## Transaction Management and Unit of Work

In the Spin Win API, transaction management is handled using the Unit of Work pattern. This pattern helps maintain data consistency and integrity during operations that span multiple steps and need to be treated as a single, atomic operation. 

The Unit of Work is implemented through the `IUnitOfWork` interface in the infrastructure project. Here's the code snippet:

```typescript
export interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;

  getRepository<T>(entity: { new (): T }): IRepository<T>;
}
```

The interface above is implemented in the database module, which includes transaction management methods like `startTransaction()`, `commitTransaction()`, and `rollbackTransaction()`. These methods allow us to control the flow of our operations and ensure that we can maintain the [ACID](https://en.wikipedia.org/wiki/ACID) properties of our transactions.

In addition, the IUnitOfWork interface provides a `getRepository<T>(entity: { new (): T }): IRepository<T>` method. This generic method allows us to get a repository for any given entity. The repositories are wrapped to conform to our `IRepository<T>` interface, abstracting the database operations away and ensuring that we can substitute the database layer if necessary.

## Aggregates and Domain Services

In the context of this project, Aggregates like [Player Aggregate](./libs/domain/src/lib/aggregates/player.aggregate.ts) are complex objects that encapsulate business rules 
and data manipulation. They ensure the consistency of changes being made within the boundary of the Aggregate. Using the `@nestjs/cqrs` package, these Aggregates extend the `AggregateRoot` class, providing them the capability of handling and producing domain events, an essential part of the CQRS (Command Query Responsibility Segregation) pattern. 

When a domain operation is performed, it not only mutates the state of the Aggregate but also produces a domain event (like a "deposit made" event). These events can then be handled within the Aggregate itself or by external handlers. Likewise, Domain Services (as seen in [Player Domain Service](./libs/domain/src/lib/services/player.service.ts) contexts) orchestrate these operations with the  Aggregates, employing Repositories to handle persistence. 

The Domain Service completes the operation by committing changes, and the events produced get dispatched.

## From Domain to Database: Entity Representation and Interaction in DDD and CQRS Architecture

This project differentiates the roles of classes when handling entities like 'Player' across multiple layers.

1. **Domain Layer**: Here we find the `Player` entity, as defined in [player.entity.ts](./libs/domain/src/lib/entities/player/player.entity.ts). This is a plain class focusing solely on business rules and domain logic, with no awareness of any persistence or infrastructure details.

2. **Database Layer (db-model)**: The `PlayerModel` class, defined in [player.model.ts](./libs/db-models/src/lib/player/player.model.ts), uses TypeORM decorators like `Entity`, `Column`, and `PrimaryGeneratedColumn` to map domain entities to database tables. Significantly, it provides `toDomain` and `fromDomain` methods that serve as translators between the database and the domain layer. These methods facilitate a clean separation between our domain logic and the underlying infrastructure.

3. **Infrastructure Layer**: Here we have the `IPlayerDto` interface in [player-dto.interface.ts](./libs/infrastructure/src/lib/data/repositories/player/dto/player-dto.interface.ts). As a Data Transfer Object (DTO), it carries data between processes, bridging the gap between domain objects and infrastructure needs.

The Repository pattern plays a vital role in connecting the domain layer and the persistence layer. In `infrastructure`, the [IRepository](./libs/infrastructure/src/lib/data/repositories/repository.interface.ts) interface provides a collection-like interface for domain objects. It allows for manipulation and retrieval of entities in a storage-agnostic way.

In alignment with CQRS, we have two separate repositories for read ([PlayerReadRepository](./libs/infrastructure/src/lib/data/repositories/player/player-read.repository.ts)) and write ([PlayerWriteRepository](./libs/infrastructure/src/lib/data/repositories/player/player-write.repository.ts)) operations. These repositories interact with the actual database via the `PlayerModel`. Still, they always return domain `Player` entities or accept them for operations, which ensures the domain layer's independence from persistence-specific concerns. Notably, each method in these repositories has a clear responsibility:

- The `create`, `update`, and `delete` methods in `PlayerWriteRepository` convert domain entities to `PlayerModel` instances before performing the actual persistence operation, ensuring that domain logic isn't directly tied to database operations. They convert the result back to domain entities before returning, ensuring that the rest of the application only works with domain entities.

- The `getById` and `getAll` methods in both repositories retrieve `PlayerModel` instances from the database and convert them to `Player` entities before returning them. They essentially "translate" between the database and domain layers.


