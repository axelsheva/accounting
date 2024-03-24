use criterion::{black_box, criterion_group, criterion_main, Criterion};
use rust_transaction_processor::TransactionProcessor;
use rust_transaction_processor::ITransactionProcessor;
use rust_transaction_processor::{Balance, Deposit, Transaction, TransactionBase, TransactionType, Withdraw, Transfer, WithdrawPayload, TransferPayload, DepositPayload };
use rust_decimal::Decimal;
use std::collections::HashMap;

fn transaction_processor_benchmark(c: &mut Criterion) {
    c.bench_function("TransactionProcessor::process", |b| {
        let processor = TransactionProcessor::new();
        let mut balances = HashMap::new();
        balances.insert("account1".to_string(), Balance { id: "account1".to_string(), amount: Decimal::new(100, 0) });
        balances.insert("account2".to_string(), Balance { id: "account2".to_string(), amount: Decimal::new(50, 0) });

        let transactions = vec![
            Transaction::Deposit(Deposit {
                base: TransactionBase { id: "tx1".to_string(), transaction_type: TransactionType::Deposit },
                payload: DepositPayload { balance_id: "account1".to_string(), amount: Decimal::new(10, 0) },
            }),
            Transaction::Withdraw(Withdraw {
                base: TransactionBase { id: "tx2".to_string(), transaction_type: TransactionType::Withdraw },
                payload: WithdrawPayload { balance_id: "account2".to_string(), amount: Decimal::new(5, 0) },
            }),
            Transaction::Transfer(Transfer {
                base: TransactionBase { id: "tx3".to_string(), transaction_type: TransactionType::Transfer },
                payload: TransferPayload { from_balance_id: "account1".to_string(), to_balance_id: "account2".to_string(), amount: Decimal::new(15, 0) },
            }),
            Transaction::Deposit(Deposit {
                base: TransactionBase { id: "tx1".to_string(), transaction_type: TransactionType::Deposit },
                payload: DepositPayload { balance_id: "account1".to_string(), amount: Decimal::new(10, 0) },
            }),
            Transaction::Withdraw(Withdraw {
                base: TransactionBase { id: "tx2".to_string(), transaction_type: TransactionType::Withdraw },
                payload: WithdrawPayload { balance_id: "account2".to_string(), amount: Decimal::new(5, 0) },
            }),
            Transaction::Transfer(Transfer {
                base: TransactionBase { id: "tx3".to_string(), transaction_type: TransactionType::Transfer },
                payload: TransferPayload { from_balance_id: "account1".to_string(), to_balance_id: "account2".to_string(), amount: Decimal::new(15, 0) },
            }),
        ];

        b.iter(|| processor.process(black_box(&mut balances.clone()), black_box(transactions.clone())));
    });
}

criterion_group!(benches, transaction_processor_benchmark);
criterion_main!(benches);
