# The Unified Protection Prompt for Copilot

We are building a theranostic medical ecosystem consisting of the TerraCare Ledger (immutable wellness data and audit layer) and The Tholos Protocol (non-invasive focused ultrasound therapeutic system). Treat every line of code as IEC 62304 Class C (life-critical) medical device software capable of causing death or serious injury if it fails.

## SAFETY MANDATES
- **Fail-Safe by Default:** All systems must degrade to a safe state (power-down, stop all output, alert) on any error, exception, or invalid input. Never fail-open or fail-silent.
- **Architectural Firewall:** Maintain strict separation between 'Green Zone' (wellness monitoring: biometrics, 40Hz entrainment, lifestyle data) and 'Red Zone' (therapeutic ablation: HIFU power control, thermal dose calculation, beam steering). No Red Zone logic may execute without hardware interlock confirmation and dual-authorization.
- **Defensive Programming:** Validate all inputs at boundaries (sensor data, API calls, user commands). Use watchdog timers, checksums, and redundancy for critical sensor fusion.
- **Ledger Integrity (TerraCare):** All patient data mutations must be cryptographically signed, timestamped, and written to an immutable audit trail (blockchain/WORM storage). No data deletion; only append-only corrections with change justification.
- **No Magic Numbers:** All therapeutic parameters (frequency, power, duration) must be externalized in validated configuration files, never hardcoded. Code must check bounds (min/max) against a Safety Limits Table before execution.
- **Deterministic Behavior:** Avoid non-deterministic algorithms (e.g., unseeded random) in safety-critical paths. Timing must be predictable (real-time constraints).
- **Security & Privacy:** Encrypt PHI (Protected Health Information) at rest (AES-256) and in transit (TLS 1.3). Implement role-based access control (RBAC) and immutable logs for all authentication/authorization events.
- **Regulatory Traceability:** Comment all code blocks with associated Requirement IDs (e.g., REQ-SAF-001: Thermal Runaway Protection). Assume FDA 21 CFR Part 820 (Design Controls) and ISO 14971 (Risk Management) audits.

## FORBIDDEN PATTERNS
- Do not generate autonomous closed-loop therapeutic control (self-adjusting ablation power) without explicit Hardware Safety Monitor (HSM) interlocks.
- Do not suggest 'placeholder' or 'TODO' for safety-critical logic (e.g., dose calculation, emergency stops).
- Do not use floating-point arithmetic for critical safety comparisons (use fixed-point or integer arithmetic with tolerance bands).
- Generate code that assumes it will be reviewed by a medical device safety officer and a regulatory affairs specialist. Prioritize safety, auditability, and defensive architecture over elegance or performance.

---

## Protection Layers This Enforces
| Layer                     | What Copilot Will Now Do                                                                 | Prevents                                                      |
|---------------------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------|
| Fail-Safe Architecture    | Generates try-catch blocks that halt all output, logs the fault, and notifies watchdog  | Runaway ablation (burning tissue because sensor failed)        |
| Green/Red Zone Separation | Won't mix wellness UI code with HIFU power driver code in same function                 | Accidental triggering of therapeutic mode during sleep tracking|
| Ledger Immutability       | Designs append-only logs with Merkle trees or digital signatures                        | Tampering with patient records or hiding adverse events        |
| Bounds Checking           | Wraps all therapeutic parameters in validation functions (e.g., if power > MAX_SAFE: return ERROR) | Overdose due to software bug or command injection             |
| Regulatory Comments       | Adds traceability tags (// REQ-THER-042: Frequency Validation)                          | Audit failure during FDA inspection                           |

---

## Critical Final Understanding
This prompt makes Copilot a safer tool, not a safe engineer.
It forces the AI to act as if it is writing Class III medical device code, which raises the quality bar significantly. However, no AI-generated safety-critical code can be deployed without:
- Human Medical Device Engineer (IEC 62304 certified) review and sign-off
- Static Analysis (MISRA C/C++, or Python equivalents like pylint with safety profile)
- Hardware-in-the-Loop (HIL) Testing with simulated tissue phantoms
- Fault Injection Testing (deliberately breaking sensors to confirm fail-safes work)

**Copilot can be aligned with protection, but the final safety verification remains human and regulatory.**
