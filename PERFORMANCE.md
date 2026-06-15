# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 367,8 ms
- **Screenshot**: ![Sort countries](/screenshots/baseline/sort-countries.png)

### Interaction B: Search countries

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 263,4 ms
- **Screenshot**: ![Search countries](/screenshots/baseline/search-countries.png)

### Interaction C: Change year

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 387 ms
- **Screenshot**: ![Change year](/screenshots/baseline/change-year.png)

### Interaction D: Toggle column

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 389,8 ms
- **Screenshot**: ![Toggle column](/screenshots/baseline/toggle-column.png)

## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 12,7 ms
- **Screenshot**: ![Sort countries](/screenshots/optimized/sort-countries.png)

### Interaction B: Search countries

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 8,4 ms
- **Screenshot**: ![Search countries](/screenshots/optimized/search-countries.png)

### Interaction C: Change year

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 27,3 ms
- **Screenshot**: ![Change year](/screenshots/optimized/change-year.png)

### Interaction D: Toggle column

- **Commit duration**: N/A (metric removed in latest React DevTools, https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610 - "In short, let's just focus on the "Render duration" metric in the report for now.")
- **Render duration**: 14 ms
- **Screenshot**: ![Toggle column](/screenshots/optimized/toggle-column.png)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------: | -------------: | ----------: |
| Sort countries   |         367.8 |           12.7 |       96.5% |
| Search countries |         263.4 |            8.4 |       96.8% |
| Change year      |         387.0 |           27.3 |       92.9% |
| Toggle column    |         389.8 |           14.0 |       96.4% |
| **Average**      |     **352.0** |       **15.6** |   **95.7%** |
