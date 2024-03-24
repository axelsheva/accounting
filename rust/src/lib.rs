use rust_decimal::Decimal;
use std::collections::HashMap;

// Equivalent to TypeScript's Balance
#[derive(Debug, Clone)]
pub struct Balance {
    pub id: String,
    pub amount: Decimal,
}

// TypeScript's TransactionNamespace.Type enum
#[derive(Debug, PartialEq, Clone)]
pub enum TransactionType {
    Deposit,
    Withdraw,
    Transfer,
}

// ITransactionBase in Rust
#[derive(Debug, Clone)]
pub struct TransactionBase {
    pub id: String,
    pub transaction_type: TransactionType,
}

// DepositPayload in Rust
#[derive(Debug, Clone)]
pub struct DepositPayload {
    pub balance_id: String,
    pub amount: Decimal,
}

// Deposit in Rust
#[derive(Debug, Clone)]
pub struct Deposit {
    pub base: TransactionBase,
    pub payload: DepositPayload,
}

// WithdrawPayload in Rust
#[derive(Debug, Clone)]
pub struct WithdrawPayload {
    pub balance_id: String,
    pub amount: Decimal,
}

// Withdraw in Rust
#[derive(Debug, Clone)]
pub struct Withdraw {
    pub base: TransactionBase,
    pub payload: WithdrawPayload,
}

// TransferPayload in Rust
#[derive(Debug, Clone)]
pub struct TransferPayload {
    pub from_balance_id: String,
    pub to_balance_id: String,
    pub amount: Decimal,
}

// Transfer in Rust
#[derive(Debug, Clone)]
pub struct Transfer {
    pub base: TransactionBase,
    pub payload: TransferPayload,
}

// Transaction enum in Rust
#[derive(Debug, Clone)]
pub enum Transaction {
    Deposit(Deposit),
    Withdraw(Withdraw),
    Transfer(Transfer),
}

// ITransactionProcessor in Rust
pub trait ITransactionProcessor {
    fn process(&self, balances: &mut HashMap<String, Balance>, transactions: Vec<Transaction>);
}

pub struct TransactionProcessor {
    pub minimum_allowed_balance: Decimal,
}

impl TransactionProcessor {
    pub fn new() -> Self {
        TransactionProcessor {
            minimum_allowed_balance: Decimal::new(0, 0),
        }
    }

    fn process_deposit(&self, transaction: &Deposit, balances: &mut HashMap<String, Balance>) {
        let balance = balances.get_mut(&transaction.payload.balance_id).expect("Balance is missing");
        balance.amount += transaction.payload.amount;
    }

    fn process_withdraw(&self, transaction: &Withdraw, balances: &mut HashMap<String, Balance>) {
        let balance = balances.get_mut(&transaction.payload.balance_id).expect("Balance is missing");
        balance.amount -= transaction.payload.amount;
    }

    // fn process_transfer(&self, transaction: &Transfer, balances: &mut HashMap<String, Balance>) {
    //     let from_balance = balances.get_mut(&transaction.payload.from_balance_id).expect("From balance is missing");
    //     let to_balance = balances.get_mut(&transaction.payload.to_balance_id).expect("To balance is missing");

    //     from_balance.amount -= transaction.payload.amount;
    //     to_balance.amount += transaction.payload.amount;
    // }

    fn process_transfer(&self, transaction: &Transfer, balances: &mut HashMap<String, Balance>) {
        // Separate the IDs to avoid borrowing issues
        let (from_balance_id, to_balance_id, amount) = (
            transaction.payload.from_balance_id.clone(),
            transaction.payload.to_balance_id.clone(),
            transaction.payload.amount,
        );

        // Ensure the from and to accounts are not the same
        if from_balance_id != to_balance_id {
            let mut from_balance = balances.remove(&from_balance_id).expect("From balance is missing");
            let mut to_balance = balances.remove(&to_balance_id).expect("To balance is missing");

            from_balance.amount -= amount;
            to_balance.amount += amount;

            // Re-insert the balances back into the HashMap
            balances.insert(from_balance_id, from_balance);
            balances.insert(to_balance_id, to_balance);
        } else {
            let _balance = balances.get_mut(&from_balance_id).expect("Balance is missing");
            // For transfers within the same account, you might want to handle this differently,
            // e.g., log an error or skip the transaction.
        }
    }

}

impl ITransactionProcessor for TransactionProcessor {
    fn process(&self, balances: &mut HashMap<String, Balance>, transactions: Vec<Transaction>) {
        for transaction in transactions {
            match transaction {
                Transaction::Deposit(deposit) => self.process_deposit(&deposit, balances),
                Transaction::Withdraw(withdraw) => self.process_withdraw(&withdraw, balances),
                Transaction::Transfer(transfer) => self.process_transfer(&transfer, balances),
            }
        }

        // Final balance check
        for (balance_id, balance) in balances {
            if balance.amount < self.minimum_allowed_balance {
                panic!("Final balance check failed for {}: balance is below minimum allowed.", balance_id);
            }
        }
    }
}
