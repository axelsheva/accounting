# Accounting

## Test results

Node.js

```bash
➜  node ts-node benchmark.ts
TransactionProcessorImpl#process x 386,618 ops/sec ±1.69% (89 runs sampled)
Fastest is TransactionProcessorImpl#process
```

Go

```bash
➜  go go test -bench=.
goos: darwin
goarch: arm64
pkg: accounting-go
BenchmarkProcessTransactions-10          1969898               602.9 ns/op
PASS
ok      accounting-go   2.215s
```
