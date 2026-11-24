# Calibration data — arthurgalichere.com

Generated: 2026-11-24T16:28:22+00:00 (UTC). Page: https://arthurgalichere.com/dsge/calibration.html. Full file with definitions, sources and notes: https://arthurgalichere.com/assets/data/economics/us/calibration.json. Data dictionary: https://arthurgalichere.com/assets/data/economics/us/calibration.dictionary.md. Site index: https://arthurgalichere.com/llms.txt.

Values are at full precision. unit_code: share (fraction), years, pct_y (percent a year, annualised quarterly rate), pp_y (percentage points of an annual rate), pct_q (percent a quarter), pct (percent, not a rate per period), ratio, log (natural-log points), lp100_q (log points x 100 per quarter), autocorr, net_rate_q (net rate per quarter, x - 1), none. q_decimal: the value as a decimal per quarter, the form the models use. used_by: models whose decided calibration uses the row (the page's defaults, e.g. HP-filtered survival dynamics, are shown for all models). Models: rbc = The Canonical RBC Model; lag = RBC Model with an Investment Installation Lag; stock = The RBC Model with a Stock Market; nk = The Canonical New Keynesian Model; smd = Stock-market dynamics model (forthcoming).

## Parameters (values the model pages use)

| id | symbol | value | unit | freq | models |
|---|---|---|---|---|---|
| beta | \beta | 0.982709 | ratio | Q | rbc, lag, stock |
| sigma | \sigma | 1 | none | - | rbc, lag, stock |
| theta | \theta | 3.364102 | none | - | rbc, lag, stock |
| alpha | \alpha | 0.333333 | share | - | rbc, lag, stock |
| delta | \delta | 0.025 | net_rate_q | Q | rbc, lag, stock |
| g_x | g_X | 0.00406 (gross 1.00406, log 0.00405178044) | net_rate_q | Q | rbc, lag, stock |
| rho_a | \rho_A | 0.9761 | autocorr | Q | rbc, lag, stock |
| sigma_a | \sigma_A | 0.8864 | lp100_q | Q | rbc, lag, stock |
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
| ret | 8.692020971 |  | pct_y | Q | 0.02173005243 | mean of quarterly returns x 4 (arithmetic) | 1950 Q1–2026 Q3 | rbc, lag, stock, smd |
| ret_sd | 11.75560139 |  | pct_y | Q | 0.05877800695 | sd of quarterly returns x 2 | 1950 Q1–2026 Q3 |  |
| premium | 7.845282932 |  | pct_y | Q | 0.01961320733 | mean of quarterly excess returns x 4 (arithmetic) | 1950 Q1–2026 Q3 |  |
| d_y | 3.835007948 |  | pct | - |  | mean of quarterly ratios | 1950 Q1–2026 Q3 |  |
| g_dividends | 4.12085796 | 3.046492532 | pct_y | Q | 0.0103021449 | mean log growth x 400 | 1950 Q2–2026 Q3 |  |
| nk_infl | 3.1723 |  | pct_y | Q | 0.00793075 | mean | 1954 Q3–2026 Q3 |  |
| nk_ff | 4.5939 |  | pct_y | Q | 0.01148475 | mean | 1954 Q3–2026 Q3 |  |
| s_surv | 97.698 |  | pct_q | Q | 0.97698 | mean over years of (1 - exit)^(1/4) | 1979–2023 | smd |
| rho_s | 0 |  | autocorr | Q |  | quarterly AR(1), time-aggregated from annual (HP 6.25) | 1979–2023 |  |
| sigma_s | 0.1612 |  | lp100_q | Q | 0.001612 | sd of quarterly AR(1) innovations (HP 6.25) | 1979–2023 |  |
| rho_s_lin | 0.859 |  | autocorr | Q |  | quarterly AR(1), time-aggregated from annual (linear trend) | 1979–2023 | smd |
| sigma_s_lin | 0.09289 |  | lp100_q | Q | 0.0009289 | sd of quarterly AR(1) innovations (linear trend) | 1979–2023 | smd |
| eps_bds | 0.6382 |  | pct_q | Q | 0.006382 | mean over years of 1 - (1 - x)^(1/4) | 1979–2023 | smd |
| m_data_bds | 3.987 |  | ratio | - |  | inverse of the mean ratio | 1979–2023 |  |
| startup_q | 2.591 |  | pct_q | Q | 0.02591 | annual mean converted to a quarter | 1979–2023 |  |
| est_death_q | 2.936 |  | pct_q | Q | 0.02936 | mean | 1992 Q3–2025 Q2 |  |
| iss_gross | 0.3271 |  | pct_q | Q | 0.003271 | mean of quarterly ratios | 1958 Q1–2010 Q4 |  |
| eps_ipo | 0.3467 |  | pct_q | Q | 0.003467 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| eps_ipo_listed | 0.3245 |  | pct_q | Q | 0.003245 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| eps_ipo_offer | 0.2937 |  | pct_q | Q | 0.002937 | mean over years of 1 - (1 - x)^(1/4) | 1980–2025 |  |
| rho_sent_orth | 0.9312 |  | autocorr | Q |  | AR(1) of end-of-quarter values | 1965 Q3–2025 Q4 | smd |
| eq_share | 14.1 |  | pct | - |  | mean | 1958 Q4–2025 Q4 |  |
| iss_net | -0.1557 |  | pct_q | Q | -0.001557 | mean of quarterly ratios | 1952 Q1–2026 Q2 |  |

## Implied parameters (trend growth: g_X (trend of TFP), 1.624 percent a year)

| id | value | relation | inputs | valid | used_by |
|---|---|---|---|---|---|
| beta_ret | 0.9827057525 | \beta = (1 + g_X)/(1 + r) | ret, g |  | rbc, lag, stock |
| beta_r_bill | 1.001807189 | \beta = (1 + g_X)/(1 + r) | r_bill, g |  |  |
| delta | 0.01581019178 | \delta = (I/Y)/(K/Y) - g_X | i_y, k_y, g |  |  |
| alpha | 0.3283558868 | \alpha = (r + \delta)\,K/Y | ret, delta (implied), k_y, g |  |  |
| kappa_bds | 0.9832551343 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_bds | yes | smd |
| m_bds | 3.607019743 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_bds |  | smd |
| kappa_ipo | 0.9803789739 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_ipo | yes |  |
| m_ipo | 6.639746178 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_ipo |  |  |
| kappa_ipo_listed | 0.9801606212 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, eps_ipo_listed | yes |  |
| m_ipo_listed | 7.093990755 | m = (1 - s)\,/\,\varepsilon | s_surv, eps_ipo_listed |  |  |
| kappa_iss | 0.980186189 | \kappa = s\,/\,(1 - \varepsilon) | s_surv, iss_gross | yes |  |
| kappa_dp | 0.9673449327 | \kappa = s\,(1/\beta - d/p^A)^{-1} | s_surv, dp, beta | no (outside s < kappa < 1) |  |

Implied with trend growth = Per-capita output growth (1.998102346 percent a year): beta_ret 0.9836211174; beta_r_bill 1.002740347; delta 0.01487493592; alpha 0.3201754187; kappa_bds 0.9832551343; m_bds 3.607019743; kappa_ipo 0.9803789739; m_ipo 6.639746178; kappa_ipo_listed 0.9801606212; m_ipo_listed 7.093990755; kappa_iss 0.980186189; kappa_dp 0.9673449327.

## Model steady states (model pages, baseline calibration)

- stock: d_y 0.126; pd_annual 14.21; dp_annual 7.038; return_annual 8.691
- rbc: hours 0.2; k_y_annual 1.783; i_y 0.207; c_y 0.793; r_annual 8.692
