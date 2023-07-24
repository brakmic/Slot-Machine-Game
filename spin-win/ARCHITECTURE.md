# Spin Win Documentation

The Spin Win API is divided into several modules: 
- **Bank** module
- **Player** module
- **Slot** module
- **Spin** module
- **Leaderboard** module.

All these modules implement the Hexagonal Architecture, also known as Ports and Adapters Architecture, designed by Alistair Cockburn. As of now, the Bank and Player modules are implemented, and the other modules are under development.

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

