# Calibration file: bbr — When Banks Ride the Bubble: Financial Stability and Real Activity (working title)

Generated 2026-11-27T16:11:21+00:00 (UTC). Based on Aoki, K. and K. Nikolov (2015), Bubbles, banks and financial stability, Journal of Monetary Economics 74, 33–51. Annual model without growth. JSON: https://arthurgalichere.com/assets/data/economics/us/calibration-bbr.json. Data page: https://arthurgalichere.com/economics/banks-credit.html.

Per-model calibration file (feedback W37). Parameters: AN Table 2 plus π and ξ of the draft, not yet re-calibrated for bbr. Targets: AN's value and the site's value on each sample; role as decided on 27 Nov 2026 (D6, W48): spread and D/N targeted, ROE a check, the rest reported or external. 'decided' fields are filled by the calibration chat as Arthur decides. Default sample: up to date (W47); 1959–2012 for replication only.

## Parameters (AN Table 2 and the draft; not yet re-calibrated)

| id | symbol | value | how set in AN | context |
|---|---|---|---|---|
| eta | η | 5.0 | from_literature | between micro estimates (≈ 0) and Gertler–Kiyotaki (10) |
| aH_aL | a^H/a^L | 1.1 | from_literature | from Aoki et al. (2010) |
| xi | ξ | 0.05 | set | a bank holding ξ loses 50% of its net worth when the bubble bursts but stays solvent (AN fn. 15) |
| delta | δ | 0.167 | calibrated | productive entrepreneurs stay productive 6 years on average |
| theta | θ | 0.622 | calibrated | calibrated with the other parameters to the Table 1 moments |
| lambda | λ | 0.788 | calibrated | calibrated with the other parameters to the Table 1 moments |
| gamma | γ | 0.907 | calibrated | bankers stay in business 10.7 years; pinned by ROE in AN, no longer so for bbr (D6) |
| beta | β | 0.958 | calibrated | calibrated with the other parameters to the Table 1 moments |
| n | n | 0.011 | calibrated | productive/unproductive ≈ 1.1% |
| pi | π | 0.98 | set | bubble survival; to be calibrated from crisis frequencies (stage 1) |

## Targets

Rates in percent a year (gross in brackets); samples: replication 1959–2012, full = 1959 to the latest quarter (default).

| id | role | AN | replication | full | 1985–2019 | 2000–latest | full sample |
|---|---|---|---|---|---|---|---|
| rd_minus_g | reported | -5.0 (0.95) | -3.845 (0.9616) | -3.963 (0.9604) | -3.069 (0.9693) | -3.820 (0.9618) | 1959 Q2–2026 Q3 |
| rd_m2own_minus_g | reported | -5.0 (0.95) | -3.845 (0.9616) | -3.837 (0.9616) | -3.054 (0.9695) | -3.380 (0.9662) | 1959 Q2–2019 Q2 |
| rd_fdic_minus_g | reported |  | -2.169 (0.9783) | -2.869 (0.9713) | -2.455 (0.9755) | -3.494 (0.9651) | 1984 Q2–2026 Q3 |
| rl_minus_g_gross | reported |  | 0.345 (1.0034) | 0.229 (1.0023) | 1.076 (1.0108) | 0.303 (1.0030) | 1959 Q1–2026 Q3 |
| rl_minus_g | reported | -1.8 (0.982) | -2.539 (0.9746) | -2.595 (0.9740) | -2.142 (0.9786) | -2.569 (0.9743) | 1959 Q1–2025 Q4 |
| rl_minus_g_net | reported | -1.8 (0.982) | -1.164 (0.9884) | -1.204 (0.9880) | -0.246 (0.9975) | -0.764 (0.9924) | 1959 Q1–2025 Q4 |
| spread_l_d | targeted |  | 1.324 | 1.383 | 0.927 | 1.251 | 1959 Q2–2025 Q4 |
| spread_l_d_net | targeted |  | 2.702 | 2.777 | 2.823 | 3.056 | 1959 Q2–2025 Q4 |
| m2_gdp | reported | 0.5 | 0.546 | 0.581 | 0.552 | 0.630 | 1959 Q1–2026 Q3 |
| bank_lev_h8 | targeted | 10.0 | 11.853 | 11.026 | 10.188 | 8.784 | 1973 Q1–2026 Q3 |
| bank_lev_fdic | targeted | 10.0 | 12.545 | 11.750 | 10.530 | 8.758 | 1959–2025 |
| bank_roe | check | 10.0 (1.1) | 11.209 (1.1121) | 11.033 (1.1103) | 10.650 (1.1065) | 10.106 (1.1011) | 1959–2025 |
| bank_roe_real_g | check |  | 4.033 (1.0403) | 4.250 (1.0425) | 5.339 (1.0534) | 5.286 (1.0529) | 1959–2025 |
| cost_assets_gross | input |  | 2.884 | 2.815 | 3.218 | 2.850 | 1959–2025 |
| cost_assets_net | input |  | 1.509 | 1.424 | 1.322 | 1.045 | 1959–2025 |
| corp_lev_z1_bv | reported | 0.5 | 0.862 | 0.827 | 0.652 | 0.636 | 1959 Q1–2026 Q2 |
| corp_lev_z1_mv | reported | 0.5 | 0.436 | 0.441 | 0.436 | 0.436 | 1959 Q1–2026 Q2 |
| corp_lev_indebted | external | 2.0 |  |  |  |  |  |

## Bubble-existence conditions (priority constraints, D8)

- Attractiveness for savers: real deposit rate below growth (R^d < 1): rd_minus_g < 0. Data: replication -3.845; full -3.963; 1985–2019 -3.069; 2000–latest -3.820
- Attractiveness for banks: real loan rate after costs below growth (R^l < 1): rl_minus_g < 0. Data: replication -2.539; full -2.595; 1985–2019 -2.142; 2000–latest -2.569
- Affordability: bubble return conditional on survival ≤ growth (no growth in the model: ≤ 1): model condition; data input: real GDP growth. Data: replication 3.223; full 3.073; 1985–2019 2.698; 2000–latest 2.241

## Consistency check: ROE = R^l + (D/N)(R^l − R^d)/γ with γ ≤ 1

| case | R^l | R^d | D/N | ROE | ROE floor (γ = 1) | γ implied | holds |
|---|---|---|---|---|---|---|---|
| Aoki–Nikolov data (Table 1), nominal ROE, as AN | 0.9820 | 0.9500 | 10.00 | 1.1000 | 1.3020 | 2.71 | no |
| Site data, replication sample (1959 Q1–2012 Q4), nominal ROE | 0.9746 | 0.9616 | 12.55 | 1.1121 | 1.1385 | 1.19 | no |
| Site data, replication sample (1959 Q1–2012 Q4), ROE minus inflation and growth | 0.9746 | 0.9616 | 12.55 | 1.0403 | 1.1385 | 2.49 | no |
| Site data, full sample (1959 Q1–2025 Q4), nominal ROE | 0.9740 | 0.9604 | 11.75 | 1.1103 | 1.1347 | 1.18 | no |
| Site data, full sample (1959 Q1–2025 Q4), ROE minus inflation and growth | 0.9740 | 0.9604 | 11.75 | 1.0425 | 1.1347 | 2.35 | no |

## Open for debate (calibration brief §8)

- Targets are mutually inconsistent in the model (ROE ≥ R^l + (D/N)(R^l − R^d)): decided 27 Nov: target the spread and D/N, ROE a check (D6).
- Units of ROE vs rates: model ROE is growth-adjusted real: open (K10): ROE minus inflation and growth published.
- Credit losses: loan returns net of charge-offs: open.
- Deposit rate concept: M2 own rate includes money funds; Regulation Q before 1986: partly decided: FDIC cost after 2019Q2 (D3).
- Loan rate concept: prime rate vs effective loan yield, C&I rates, Baa: open.
- π has no data target: crisis or bust frequencies: decided: three stages (D7); stage 1 inputs to publish.
- Over-identification and weights (6 parameters, 7 moments): decided: about equal, existence conditions first (D8).
- Sample and regime (deregulation 1986, Basel): decided: up-to-date samples by default (D9); regimes later.
- Corporate leverage: Compustat vs Z.1: decided: Z.1 for the average, AN's 2.0 external for indebted firms (D10).
- a^H/a^L = 1.1 and Frisch 5 from earlier papers: open: sensitivity.
- Cross-paper consistency of deflators and growth adjustment: open.
- Balanced-growth-path version: later (K16).

## π, stage 1: frequency of systemic crises (D7)

Stage 1 of the calibration of π (bubble survival, decision D7): the annual frequency of systemic banking or financial crises, crises started / years observed, and 1 − frequency. A burst of the model's bubble is not one-to-one with a measured crisis: these are inputs, not a calibration.

| source | scope | sample | crises | years | frequency | 1 − frequency | years per crisis |
|---|---|---|---|---|---|---|---|
| JST | 18 advanced economies, pooled | 1870–2020 | 88 | 2668 | 0.0330 | 0.9670 | 30.3 |
| JST | United States | 1870–2020 | 6 | 151 | 0.0397 | 0.9603 | 25.2 |
| JST | 18 advanced economies, pooled | 1946–2020 | 25 | 1350 | 0.0185 | 0.9815 | 54.0 |
| JST | United States | 1946–2020 | 2 | 75 | 0.0267 | 0.9733 | 37.5 |
| JST | 18 advanced economies, pooled | 1970–2020 | 25 | 918 | 0.0272 | 0.9728 | 36.7 |
| JST | United States | 1970–2020 | 2 | 51 | 0.0392 | 0.9608 | 25.5 |

US crisis start years, JST: 1873, 1893, 1907, 1930, 1984, 2007.
Sources: ; Jordà, Ò., M. Schularick and A. M. Taylor (2017), Macrofinancial History and the New Business Cycle Facts, NBER Macroeconomics Annual 2016, 31: 213–263; Jordà–Schularick–Taylor Macrohistory Database (CC BY-NC-SA 4.0), variable crisisJST (systemic financial crisis, start year).
