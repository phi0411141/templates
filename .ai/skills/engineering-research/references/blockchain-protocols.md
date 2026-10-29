# Protocol / Blockchain Investigation

Read this when the topic is a DEX, launchpad, AMM, bonding curve, staking system, token protocol, bridge, lending protocol, or blockchain infrastructure — or whenever a formula, fee, or pricing mechanism must be pinned down exactly.

## Contents

1. Evidence sources specific to protocols
2. What to determine (contracts, token, trading mechanics, fees, lifecycle)
3. Formula research format
4. Numerical verification checklist
5. Worked example

---

## 1. Evidence sources

In addition to the general hierarchy:

- deployed program/contract code (verified source on an explorer, or decompiled if not)
- IDL / ABI — often the fastest way to enumerate instructions and account layouts
- official SDK and its transaction builders (the SDK's math is frequently the only readable copy of the on-chain math)
- frontend network requests (what the official UI actually sends)
- real transactions on the explorer — decode inputs, logs, and balance changes
- security audits (they usually state the formulas and invariants explicitly)
- the protocol's own tests

Useful sandbox moves: clone the SDK repo and grep for `fee`, `denominator`, `bps`, `virtual`, `reserve`, `curve`, `graduat`, `migrat`; fetch the IDL JSON and list instruction names and account fields; pull a recent transaction and reconcile the reported balance changes with your reproduction.

---

## 2. What to determine

### Contracts / programs

- program/contract addresses (per network — mainnet vs testnet)
- deployed versions and whether the deployment is upgradeable
- upgrade authority and other privileged roles
- relevant accounts / storage layout
- instruction set / external functions
- PDA derivation or address derivation scheme
- emitted events / logs

### Token

- mint / contract address
- total supply, decimals
- initial allocation
- mint authority, freeze authority (or equivalent), whether renounced
- token extensions / hooks / transfer taxes
- burned or locked supply

### Trading mechanics

- pricing mechanism (constant product, constant sum, custom bonding curve, oracle, order book)
- AMM invariant or curve equation
- reserve accounting: virtual reserves vs real reserves
- price calculation, buy calculation, sell calculation
- rounding behavior
- minimum / maximum trade sizes
- slippage handling and any price-impact limits

### Fees

- protocol fee, creator fee, platform fee, LP fee, referral fee
- fee denominator (10_000? 1_000_000? percent?)
- whether the fee is taken from input before pricing or from output after pricing
- fee destination accounts
- whether fees change across the lifecycle (e.g. pre- vs post-graduation)

### Lifecycle (launchpads)

1. token creation
2. initial state and initial reserves
3. trading phase
4. curve progression (what changes as reserves move)
5. graduation condition (reserve threshold, market cap, time)
6. liquidity migration (to which venue, how much, who receives LP tokens, are they burned/locked)
7. post-graduation trading venue and fee structure
8. authority changes at graduation
9. token behavior after migration

---

## 3. Formula research format

Use this format for every formula you establish.

### Formula

```text
y = f(x)
```

### Variables

```text
x = ...
y = ...
k = ...
```

### Units

```text
SOL reserve: lamports (u64)
Token reserve: base units (u64, 6 decimals)
Fee: basis points, denominator 10_000
```

### State transition

```text
Before:   x₀, y₀
Input:    Δx
After:    x₁, y₁
```

### Rounding

State explicitly: floor, ceil, integer division, decimal precision, and at which step rounding happens.

### Fees

Show exactly where fees enter — before the invariant, after it, or both.

### Worked example

Concrete numbers, computed in Python in the sandbox, not by hand.

### Verification

State what the example matches: source code, SDK output, an observed transaction (link it), or documentation. If it matches only documentation, say so — that is weaker.

---

## 4. Numerical verification checklist

A formula is not understood until it reproduces protocol behavior closely enough to explain observed outputs.

1. Write the formula.
2. Define every variable.
3. Identify integer units and widths (u64? u128? does intermediate multiplication overflow?).
4. Identify decimal conversions.
5. Identify rounding direction at each step.
6. Identify fee placement.
7. Reproduce at least one real transaction (preferred) or a realistic calculation.
8. Compare your output to the observed output; explain any residual to the last unit if possible.

Common failure points: floating-point arithmetic where the chain uses integers; fee applied on the wrong side; virtual reserves confused with real; decimals mismatch between SOL/ETH and the token; rounding toward the protocol vs toward the user.

---

## 5. Worked example (illustrative)

Suppose the SDK contains:

```rust
const FEE_BPS: u64 = 100;
const FEE_DENOM: u64 = 10_000;

fn buy(sol_in: u64, v_sol: u64, v_tok: u64) -> u64 {
    let fee = sol_in * FEE_BPS / FEE_DENOM;
    let net = sol_in - fee;
    let k = (v_sol as u128) * (v_tok as u128);
    let new_sol = v_sol + net;
    let new_tok = (k / new_sol as u128) as u64;   // integer division = floor
    v_tok - new_tok
}
```

Formula:

```text
fee      = floor(Δsol · 100 / 10_000)
net      = Δsol − fee
k        = v_sol · v_tok
v_sol'   = v_sol + net
v_tok'   = floor(k / v_sol')
tokens_out = v_tok − v_tok'
```

Reproduce in the sandbox:

```python
v_sol, v_tok = 30_000_000_000, 1_073_000_000_000_000
d = 1_000_000_000
fee = d * 100 // 10_000
net = d - fee
k = v_sol * v_tok
new_sol = v_sol + net
new_tok = k // new_sol
print(v_tok - new_tok)   # → 34_277_831_558_568
```

Then compare against a real buy transaction of 1 SOL on the explorer. If the on-chain output is 34,277,831,558,568 base units, the formula is **Confirmed**. If it is off by a few units, check rounding and fee placement before anything else.
