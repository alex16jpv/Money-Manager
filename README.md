# Money Manager

Welcome to Money Manager, your ultimate companion for keeping track of your personal finances. This app is designed to help you manage your money like a pro, with a dash of fun and simplicity. Below you'll find all the information you need to get started, the types of accounts and transactions we support, and some light-hearted commentary to keep things interesting.

### Table of Contents

- Models
- Account Types
- Transaction Types
- Endpoints
- Creating Transactions
- Updating Balances

## Models

### Accounts

Every financial journey starts with an account. Here's how we model accounts in our database:

```javascript
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ACCOUNT_TYPES,
    },
    balance: {
      type: Number,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);
```

### Transactions

Transactions make the world (and your wallet) go round. Here's our transaction schema:

```javascript
const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPES,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    from_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ACCOUNT,
      required: false,
    },
    to_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.ACCOUNT,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);
```

## Account Types

Money Manager supports a variety of account types to fit all your financial needs. Here's the full list:

- **CASH**: For those who like to keep it old school.

- **ACCOUNT**: Your typical bank account.

- **CARD**: Credit cards for the shopaholic in you.

- **DEBIT_CARD**: Swipe away, but with your own money.

- **SAVINGS**: For those rainy days or that dream vacation.

- **INVESTMENT**: Watch your money grow (hopefully).

- **OVERDRAFT**: Because sometimes you need a little extra.

- **LOAN**: For the big purchases that need a little help.

- **OTHER**: Anything else you can think of.

## Transaction Types

We also support a variety of transaction types to keep your finances in check:

- **INCOME**: Money coming in.

- **EXPENSE**: Money going out.

- **TRANSFER**: Moving money from one place to another.

## Endpoints

Here's how you can interact with Money Manager through our API.

### Accounts

- **GET /accounts**: List all the accounts, sorted by creation date.

- **POST /accounts**: Create a new account.

- **GET /accounts/:id**: Get details of a specific account by its ID.

### Transactions

- **GET /transactions**: List all transactions, with pagination (10 per page by default). Sorted by date and creation date. Use limit and skip query params to customize.

- **POST /transactions**: Create a new transaction linked to an account.

- **GET /transactions/:id**: Get details of a specific transaction by its ID.

## Creating Transactions

When you create a transaction, you’ll need to provide the following information:

- **type**: The type of transaction (INCOME, EXPENSE, or TRANSFER).

- **amount**: The amount of money involved.

- **date**: When the transaction happened.

- **category**: Optional. Categorize your transaction for better tracking.

- **description**: Optional. Add a note to remember what this transaction was about.

- **from_account_id**: Optional. The account the money is coming from.

- **to_account_id**: Optional. The account the money is going to.

- **user_id**: Optional. The user who made the transaction.

## Updating Balances

Every time a transaction is created, the balance of the relevant account(s) is updated automatically. So you can sit back, relax, and watch your money do the math.
