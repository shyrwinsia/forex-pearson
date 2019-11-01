# Forex Pearson

![](demo.gif)

This is a force-directed graph visualization of the Pearson Correlation Coefficient (PCC) of the world's top traded currency pairs. This can be used to provide insight on what pairs move the same way (or opposite) and calculate the risk accordingly.

PCC is the covariance or two variables divided by the product of their standard deviations. This was applied on closing price over 50 trading bars of the timeframe. The visualization shows the highly correlated pairs to be nearer each other and with wider links. Green shows positive correlation while red is negative. The threshold was placed at absolute value of 0.80 for PCC. All those below the threshold do not exhibit any linear correlation and thus are not shown.

This retrieves the data from https://www.mataf.net/en/forex/tools/correlation

## Getting Started

### Prerequisites

You need to have npm installed. You can download it [here](https://nodejs.org/en/download/).

### Installing

To install the dependencies, run this command:

```
npm install
```

The source code is written in Typescript so it has to be translated to Javascript. To do this, run this command:

```
npm run-script build
```

## Running

To run the script, run this command:

```
npm start
```

Then run the index.html

# Todo

- [ ] Add filters in the UI
- [ ] Add 5 min, 1 hr, 4 hr timeframe
- [ ] Create as Electron Standalone
- [ ] Package with Parcel
- [ ] Create installer for Windows and Mac

## License

MIT
