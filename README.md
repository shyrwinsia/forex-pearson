# Forex Pearson

![](img/demo.gif)

_Click [here](https://github.com/shyrwinsia/fxpc) for the command-line tool._

This is a force-directed graph visualization of the Pearson Correlation Coefficient (PCC) of the world's top traded currency pairs. This can be used to provide insight on what pairs move the same way (or opposite) and calculate the risk accordingly.

PCC is the covariance of two variables divided by the product of their standard deviations. This was applied on closing price over 50 trading bars of the timeframe. The visualization shows the highly correlated pairs to be nearer each other and with wider links. Green shows positive correlation while red is negative. The threshold was placed at absolute value of 0.80 for PCC. All those below the threshold do not exhibit any linear correlation and thus are not shown.

This retrieves the data from https://www.mataf.net/en/forex/tools/correlation.

## Getting Started

### Prerequisites

You need to have npm installed. You can download it [here](https://nodejs.org/en/download/).

### Installing

To install the dependencies, run this command:

```
$ yarn
```

For development, run this command:

```
$ yarn start
```

To bundle for production:

```
$ yarn dist
```

## Todo

- [ ] Add filters in the UI
- [ ] Add 5 min, 1 hr, 4 hr timeframe
- [ ] Add refresh rate with the time frame
- [x] Create as Electron Standalone
- [x] Package with Parcel
- [ ] Create installer for Windows and Mac

## Disclaimer
The information from this tool is not intended as, and shall not be understood or construed as, financial advice. I am not an attorney or a financial advisor, nor am I holding myself out to be. The information from this tool is not a substitute for financial advice from a professional. Nothing from this tool should be understood as a recommendation that you should not consult a financial professional. It is expressly recommended to seek advice from a professional.

## License

MIT
