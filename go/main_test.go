package main

import (
	"fmt"
	"testing"

	"github.com/shopspring/decimal"
)

func generateMockData(n int) (map[string]*Balance, []Transaction) {
	balances := make(map[string]*Balance)
	transactions := make([]Transaction, n)

	for i := 0; i < n; i++ {
		balanceID := fmt.Sprintf("balanceID%d", i)
		balances[balanceID] = &Balance{ID: balanceID, Amount: decimal.NewFromInt(1000)}

		transactionType := Deposit
		if i%3 == 0 {
			transactionType = Withdraw
		} else if i%2 == 0 {
			transactionType = Transfer
		}

		amount := decimal.NewFromInt(10)
		var payload any

		switch transactionType {
		case Deposit:
			payload = DepositPayload{BalanceID: balanceID, Amount: amount}
		case Withdraw:
			payload = WithdrawPayload{BalanceID: balanceID, Amount: amount}
		case Transfer:
			payload = TransferPayload{FromBalanceID: balanceID, ToBalanceID: "balanceID0", Amount: amount}
		}

		transactions[i] = Transaction{ID: fmt.Sprintf("txID%d", i), Type: transactionType, Payload: payload}
	}

	return balances, transactions
}

func BenchmarkProcessTransactions(b *testing.B) {
	balances, transactions := generateMockData(6)
	processor := NewTransactionProcessor()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		processor.Process(balances, transactions)
	}
}
