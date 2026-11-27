# Calibration data — arthurgalichere.com

Generated: 2026-11-27T16:12:10+00:00 (UTC). Page: https://arthurgalichere.com/dsge/calibration.html. Full file with definitions, sources and notes: https://arthurgalichere.com/assets/data/economics/us/calibration.json. Data dictionary: https://arthurgalichere.com/assets/data/economics/us/calibration.dictionary.md. Site index: https://arthurgalichere.com/llms.txt.

Values are at full precision. unit_code: share (fraction), years, pct_y (percent a year, annualised quarterly rate), pp_y (percentage points of an annual rate), pct_q (percent a quarter), pct (percent, not a rate per period), ratio, log (natural-log points), lp100_q (log points x 100 per quarter), autocorr, net_rate_q (net rate per quarter, x - 1), none. q_decimal: the value as a decimal per quarter, the form the models use. used_by: models whose decided calibration uses the row (the page's defaults, e.g. HP-filtered survival dynamics, are shown for all models). Models: rbc = The Canonical RBC Model; lag = RBC Model with an Investment Installation Lag; stock = The RBC Model with a Stock Market; nk = The Canonical New Keynesian Model; smd = Stock-market dynamics model (forthcoming).

## Parameters (values the model pages use)

| id | symbol | value | unit | freq | models |
|---|---|---|---|---|---|
| beta | \beta | 0.9827094467 | ratio | Q | rbc, lag, stock |
| sigma | \sigma | 1 | none | - | rbc, lag, stock |
| theta | \theta | 3.364101396 | none | - | rbc, lag, stock |
| alpha | \alpha | 0.3333333333 | share | - | rbc, lag, stock |
| delta | \delta | 0.025 | net_rate_q | Q | rbc, lag, stock |
| g_x | g_X | 0.004063774498 (gross 1.004063774, log 0.004055539669) | net_rate_q | Q | rbc, lag, stock |
| rho_a | \rho_A | 0.976122 | autocorr | Q | rbc, lag, stock |
| sigma_a | \sigma_A | 0.886379 | lp100_q | Q | rbc, lag, stock |
| phi | \phi | 0.17 | share | - | lag |
| rho_phi | \rho_\phi | 0.737 | autocorr | Q | lag |
| sigma_phi | \sigma_\phi | 0.3569 | lp100_q | Q | lag |
| nk_beta | \beta | 0.99 | ratio | Q | nk |
| nk_sigma | \sigma | 1 | none | - | nk |
| nk_eta | \eta | 5 | none | - | nk |
| nk_eps | \varepsilon | 11 | none | - | nk |
| nk_xi | \xi | 0.7 | share | Q | nk |
| nk_omega | \omega | 75 | none | - | nk |
| nk_phi_pi | \phi_\pi | 1.5 | none | Q | nk |
| nk_phi_y | \phi_y | 0.125 | none | Q | nk |
| nk_rho_a | \rho_A | 0.7382997074 | autocorr | Q | nk |
| nk_rho_th | \rho_\theta | 0.8158590913 | autocorr | Q | nk |
| nk_rho_z | \rho_\zeta | 0.8764921419 | autocorr | Q | nk |
| nk_sd_a | \sigma_A | 0.7522296624 | lp100_q | Q | nk |
| nk_sd_th | \sigma_\theta | 5.914145756 | lp100_q | Q | nk |
| nk_sd_z | \sigma_\zeta | 1.753184727 | lp100_q | Q | nk |
| nk_sd_nu | \sigma_\nu | 3.193488054 | pp_y | Q | nk |

## Data targets (US)

| id | value | per capita | unit | freq | q_decimal | stat | sample | used_by |
|---|---|---|---|---|---|---|---|---|
| c_y | 0.6371 |  | share | - |  | mean of quarterly ratios | 1947 Q1–2026 Q3 |  |
| i_y | 0.1738 |  | share | - |  | mean of quarterly ratios | 1947 Q1–2026 Q3 |  |
| g_y | 0.203 |  | share | - |  | mean of quarterly ratios | 1947 Q1–2026 Q3 |  |
| i_ci | 0.2143297571 |  | share | - |  | ratio of mean shares | 1947 Q1–2026 Q3 |  |
| k_y | 2.186692533 |  | years | - |  | mean of annual ratios | 1950–2024 |  |
| k_y_nonres | 1.167628907 |  | years | - |  | mean of annual ratios | 1950–2024 |  |
| hours | 0.2 |  | share | - |  | literature value |  | rbc, lag, stock, smd |
| g_output | 3.072474752 | 1.998102346 | pct_y | Q | 0.00768118688 | mean log growth x 400 | 1950 Q2–2026 Q3 |  |
| g_consumption | 3.179914743 | 2.105548241 | pct_y | Q | 0.007949786858 | mean log growth x 400 | 1950 Q2–2026 Q3 |  |
| r_bill | 0.8994987366 |  | pct_y | Q | 0.002248746842 | mean | 1950 Q1–2026 Q2 |  |
| r_bill_sd | 2.713009642 |  | pp_y | Q | 0.006782524105 | sd | 1950 Q1–2026 Q2 |  |
| inflation | 3.146315664 |  | pct_y | Q | 0.00786578916 | mean of annualised quarterly rates | 1950 Q1–2026 Q3 |  |
| fedfunds | 4.593876113 |  | pct_y | Q | 0.01148469028 | mean | 1954 Q3–2026 Q3 |  |
| tbill | 4.05731775 |  | pct_y | Q | 0.01014329438 | mean | 1950 Q1–2026 Q3 |  |
| pd | 40.14128697 |  | ratio | - |  | mean (arithmetic) | 1950 Q1–2026 Q3 |  |
| pd_sd | 0.4552873381 |  | log | - |  | sd of ln(P/D) | 1950 Q1–2026 Q3 |  |
| pd_ar1 | 0.9907955614 |  | autocorr | Q |  | first-order autocorrelation of ln(P/D) | 1950 Q1–2026 Q3 |  |
| dp | 3.053966808 |  | pct | - | 0.00763491702 | mean (arithmetic) | 1950 Q1–2026 Q3 |  |
| ret | 8.693108007 |  | pct_y | Q | 0.02173277002 | mean of quarterly returns x 4 (arithmetic) | 1950 Q1–2026 Q3 | rbc, lag, stock, smd |
| ret_sd | 11.7558209 |  | pct_y | Q | 0.0587791045 | sd of quarterly returns x 2 | 1950 Q1–2026 Q3 |  |
| premium | 7.845282932 |  | pct_y | Q | 0.01961320733 | mean of quarterly excess returns x 4 (arithmetic) | 1950 Q1–2026 Q3 |  |
| d_y | 3.834980945 |  | pct | - |  | mean of quarterly ratios | 1950 Q1–2026 Q3 |  |
| g_dividends | 4.122119954 | 3.047753277 | pct_y | Q | 0.01030529989 | mean log growth x 400 | 1950 Q2–2026 Q3 |  |
| nk_infl | 3.1723 |  | pct_y | Q | 0.00793075 | mean | 1954 Q3–2026 Q3 |  |
| nk_ff | 4.5939 |  | pct_y | Q | 0.01148475 | mean | 1954 Q3–2026 Q3 |  |
| s_surv | 97.698 |  | pct_q | Q | 0.97698 | mean over years of (1 - exit)^(1/4) | 1979–2023 | smd |
| rho_s | 0 |  | autocorr | Q |  | quarterly AR(1), time-aggregated from annual (HP 6.25) | 1979–2023 |  |
| sigma_s | 0.161197 |  | lp100_q | Q | 0.00161197 | sd of quarterly AR(1) innovations (HP 6.25) | 1979–2023 |  |
| rho_s_lin | 0.858995 |  | autocorr | Q |  | quarterly AR(1), time-aggregated from annual (linear trend) | 1979–2023 | smd |
| sigma_s_lin | 0.0928927 |  | lp100_q | Q | 0.000928927 | sd of quarterly AR(1) innovations (linear trend) | 1979–2023 | smd |
| eps_bds | 0.638199 |  | pct_q | Q | 0.00638199 | mean over years of 1 - (1 - x)^(1/4) | 1979–2023 | smd |
| m_data_bds | 3.98655 |  | ratio | - |  | inverse of the mean ratio | 1979–2023 |  |
| startup_q | 2.59092 |  | pct_q | Q | 0.0259092 | annual mean converted to a quarter | 1979–2023 |  |
| est_death_q | 2.93636 |  | pct_q | Q | 0.0293636 | mean | 1992 Q3–2025 Q2 |  |
| iss_gross | 0.327075 |  | pct_q | Q | 0.00327075 | mean of quarterly ratios | 1958 Q1–2010 Q4 |  |
| eps_ipo | 0.34665 |  | pct_q | Q | 0.0034665 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| eps_ipo_listed | 0.324499 |  | pct_q | Q | 0.00324499 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| eps_ipo_offer | 0.293732 |  | pct_q | Q | 0.00293732 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| rho_sent_orth | 0.931216 |  | autocorr | Q |  | AR(1) of end-of-quarter values | 1965 Q3–2025 Q4 | smd |
| eq_share | 14.1035 |  | pct | - |  | mean | 1958 Q4–2025 Q4 |  |
| iss_net | -0.155675 |  | pct_q | Q | -0.00155675 | mean of quarterly ratios | 1952 Q1–2026 Q2 |  |

## Implied parameters (trend growth: g_X (trend of TFP), 1.625509799 percent a year)

| id | value | relation | inputs | valid | used_by |
|---|---|---|---|---|---|
| beta_ret | 0.9827068329 | \beta = (1 + g_X)/(1 + r) | ret, g |  | rbc, lag, stock |
| beta_r_bill | 1.001810955 | \beta = (1 + g_X)/(1 + r) | r_bill, g |  |  |
| delta | 0.01580641728 | \delta = (I/Y)/(K/Y) - g_X | i_y, k_y, g |  |  |
| alpha | 0.3283466423 | \alpha = (r + \delta)\,K/Y | ret, delta (implied), k_y, g |  |  |
| kappa_bds | 0.9832551244 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_bds | yes | smd |
| m_bds | 3.607025395 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_bds |  | smd |
| kappa_ipo | 0.980378482 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_ipo | yes |  |
| m_ipo | 6.64070388 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_ipo |  |  |
| kappa_ipo_listed | 0.9801606114 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_ipo_listed | yes |  |
| m_ipo_listed | 7.094012616 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_ipo_listed |  |  |
| kappa_iss | 0.9801859432 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, iss_gross | yes |  |
| kappa_dp | 0.9673453758 | \kappa = s\,(1/\beta - d/p^A)^{-1} | s_surv, dp, beta | no (outside s < kappa < 1) |  |

Implied with trend growth = Per-capita output growth (1.998102346 percent a year): beta_ret 0.9836185012; beta_r_bill 1.002740347; delta 0.01487493592; alpha 0.3201991889; kappa_bds 0.9832551244; m_bds 3.607025395; kappa_ipo 0.980378482; m_ipo 6.64070388; kappa_ipo_listed 0.9801606114; m_ipo_listed 7.094012616; kappa_iss 0.9801859432; kappa_dp 0.9673453758.

## Model steady states (model pages, baseline calibration)

- stock: d_y 0.126; pd_annual 14.21; dp_annual 7.038; return_annual 8.692
- rbc: hours 0.2; k_y_annual 1.783292; i_y 0.207317; c_y 0.792683; r_annual 8.692021

## Values in the literature (W42-W43)

Each value a paper uses for a row above, in the paper's own units and frequency. checked: read in the paper itself (page or table in 'where'); otherwise transcribed from a calibration brief and still to be checked.

| row | paper | model type | freq | value | how set | moment or source | where | checked |
|---|---|---|---|---|---|---|---|---|
| beta | King and Rebelo (1999) | RBC | Q | 0.984 | targeted | real return of 1.6% a quarter (R = 1.016) |  | no |
| beta | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.98271 | implied | beta = g_X / R^s: real S&P 500 return 2.173% a quarter (1950Q1-2026Q3) and g_X 1.004064 | calibration brief (smd), §4 | yes |
| beta | Aoki and Nikolov (2015) | financial frictions with banks and bubbles | A | 0.958 | calibrated | jointly with the other parameters to the Table 1 moments | Table 2 | no |
| sigma | King and Rebelo (1999) | RBC | - | 1 | set | log utility (balanced growth) |  | no |
| sigma | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | - | 1 | from_literature | King and Rebelo (1999) benchmark | calibration brief (smd), §4 | yes |
| theta | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | - | 3.547068 | targeted | hours h = 0.2 in the model with firm exit | calibration brief (smd), §4 | yes |
| alpha | King and Rebelo (1999) | RBC | - | 0.3333 | targeted | capital share of income | Table 2 | no |
| alpha | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | - | 0.3333 | from_literature | King and Rebelo (1999) | calibration brief (smd), §4 | yes |
| delta | King and Rebelo (1999) | RBC | Q | 0.025 | targeted | depreciation rate of 10% a year | Table 2 | no |
| delta | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.025 | from_literature | King and Rebelo (1999) | calibration brief (smd), §4 | yes |
| g_x | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.004064 | estimated | OLS linear trend of log measured TFP / (1 - alpha), 1947Q1-2026Q3 | calibration brief (smd), §4 | yes |
| rho_a | King and Rebelo (1999) | RBC | Q | 0.979 | estimated | AR(1) of measured TFP in deviation from a linear trend |  | no |
| rho_a | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.9761 | estimated | AR(1) of log measured TFP (Fernald) minus its linear trend, 1947Q1-2026Q3 | calibration brief (smd), §4 | yes |
| sigma_a | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.8864 | estimated | standard deviation of the AR(1) innovations, percent | calibration brief (smd), §4 | yes |
| k_y_nonres | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | A | 1.168 | check | private nonresidential fixed assets / GDP, 1950-2024; model 1.18 | calibration brief (smd), §4 | yes |
| hours | King and Rebelo (1999) | RBC | - | 0.2 | set | share of available time spent working |  | no |
| ret | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 8.692 | targeted | mean real S&P 500 return, arithmetic, 1950Q1-2026Q3 (2.173% a quarter) | calibration brief (smd), §4 | yes |
| s_surv | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 97.698 | targeted | Census BDS firm exit, 1979-2023: mean over years of (1 - exit)^(1/4) | calibration brief (smd), §4 | yes |
| rho_s_lin | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.859 | estimated | linear-trend AR(1) of 100 x ln annual survival, 1979-2023, time-aggregated to a quarter | calibration brief (smd), §4 | yes |
| sigma_s_lin | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.0929 | estimated | standard deviation of the quarterly innovations, percent | calibration brief (smd), §4 | yes |
| rho_sent_orth | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.93 | from_data | AR(1) of the orthogonalised Baker-Wurgler index, 1965Q3-2025Q4 (0.9312); also the prior mean | calibration brief (smd), §4 | yes |
| delta | King and Rebelo (1999) | RBC | Q | 0.025 | targeted | depreciation rate of 10% a year | Table 2 | no |
| delta | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.025 | from_literature | King and Rebelo (1999) | calibration brief (smd), §4 | yes |
| alpha | King and Rebelo (1999) | RBC | - | 0.3333 | targeted | capital share of income | Table 2 | no |
| alpha | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | - | 0.3333 | from_literature | King and Rebelo (1999) | calibration brief (smd), §4 | yes |
| kappa_bds | Galichère, stock-market dynamics (2026) | RBC with firm exit and a stock market | Q | 0.983255 | implied | kappa = s / (1 - nu), nu = BDS startup employment share 0.6382% a quarter, 1979-2023 | calibration brief (smd), §4-5 | yes |

## Role of each row in a model's calibration (W44)

| row | model | role | weight | note |
|---|---|---|---|---|
| k_y_nonres | smd | check |  | follows from R^s, s, delta, alpha; passes (1.18 vs 1.17) |
| hours | smd | targeted |  | pins theta (h = 0.2) |
| dp | smd | known_miss |  | untargeted; implied 9.59% a year against 3.05% in the data |
| ret | smd | targeted |  | pins beta with g_X |
| s_surv | smd | targeted |  | survival s |
| rho_s_lin | smd | targeted |  | persistence of survival shocks (linear trend) |
| sigma_s_lin | smd | targeted |  | size of survival shocks |
| eps_bds | smd | targeted |  | pins kappa with s (same firms and years) |
| rho_sent_orth | smd | targeted |  | calibrated rho_kappa and prior mean |
| kappa_bds | smd | implied |  | kappa = s / (1 - nu) |

Papers: King and Rebelo (1999): King, R. G. and S. T. Rebelo (1999). Resuscitating Real Business Cycles. In J. B. Taylor and M. Woodford (eds.), Handbook of Macroeconomics 1B: 927-1007. Aoki and Nikolov (2015): Aoki, K. and K. Nikolov (2015). Bubbles, Banks and Financial Stability. Journal of Monetary Economics 74: 33-51. Galichère, stock-market dynamics (2026): Galichère, A. (2026). Stock Market Dynamics in the RBC Framework. Working paper (calibration decided 21 Nov 2026). Galichère, banks and bubbles (draft, 2026): Galichère, A. (2026). When Banks Ride the Bubble: Financial Stability and Real Activity. Draft of 13 May 2026.
