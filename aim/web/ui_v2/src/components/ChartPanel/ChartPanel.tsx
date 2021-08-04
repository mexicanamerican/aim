import React from 'react';
import {
  Grid,
  Paper,
  Popover,
  Typography,
  Box,
  PopoverPosition,
} from '@material-ui/core';
import { isEqual } from 'lodash-es';

import { IChartPanelProps } from 'types/components/ChartPanel/ChartPanel';
import LineChart from 'components/LineChart/LineChart';

import useStyles from './chartPanelStyle';
import chartGridPattern from 'config/chart-grid-pattern/chartGridPattern';
import { ISyncHoverStateParams } from 'types/utils/d3/drawHoverAttributes';

const ChartPanel = React.forwardRef(function ChartPanel(
  props: IChartPanelProps,
  ref,
) {
  const classes = useStyles();

  const [chartRefs, setChartsRefs] = React.useState<React.RefObject<any>[]>(
    new Array(props.data.length).fill('*').map(() => React.createRef()),
  );
  const [popover, setPopover] = React.useState<PopoverPosition | null>(null);

  const onPopoverChange = React.useCallback(
    (popover: PopoverPosition | null): void => {
      setPopover((prevState) => {
        if (isEqual(prevState, popover)) {
          return prevState;
        }
        return popover;
      });
    },
    [],
  );

  const syncHoverState = React.useCallback(
    (params: ISyncHoverStateParams): void => {
      const { activePoint, focusedStateActive } = params;
      // on MouseHover
      if (activePoint !== null) {
        chartRefs.forEach((chartRef, index) => {
          if (index === activePoint.chartIndex) {
            return;
          }
          chartRef.current?.updateHoverAttributes?.(activePoint.xValue);
        });
        if (props.onActivePointChange) {
          props.onActivePointChange(activePoint, focusedStateActive);
        }
        onPopoverChange({
          top: activePoint.pageY as number,
          left: activePoint.pageX as number,
        });
      }
      // on MouseLeave
      else {
        chartRefs.forEach((chartRef) => {
          chartRef.current?.clearHoverAttributes?.();
        });
        onPopoverChange(null);
      }
    },
    [],
  );

  React.useImperativeHandle(ref, () => ({
    setActiveLine: (lineKey: string) => {
      chartRefs.forEach((chartRef) => {
        chartRef.current?.setActiveLine?.(lineKey);
      });
    },
  }));

  React.useEffect(() => {
    chartRefs.forEach((chartRef) => {
      chartRef.current?.setFocusedState?.(props.focusedState);
    });
  }, [props.focusedState]);

  // TODO: remove setTimeout
  React.useEffect(() => {
    setTimeout(() => {
      setChartsRefs((refs) => [...refs]);
    });
  }, []);

  return (
    <Grid container spacing={1} className={classes.chartContainer}>
      <Grid item xs className={classes.chartPanel}>
        <Paper className={classes.paper}>
          <Grid container spacing={1} className={classes.chartGrid}>
            {props.data.map((lineChartData, index) => (
              <Grid
                key={index}
                //TODO generate new only when chart changes
                // key={lineChartData.map((line) => line.key).join('_')}
                item
                xs={
                  props.data.length > 9
                    ? 4
                    : (chartGridPattern[props.data.length][index] as any)
                }
              >
                <LineChart
                  ref={chartRefs[index]}
                  {...props.chartProps[0]}
                  index={index}
                  data={lineChartData}
                  syncHoverState={syncHoverState}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.paper}>{props.controls}</Paper>
      </Grid>
      {!!popover && (
        <Popover
          id={'lineChart-popover'}
          open={!!(props.data.length > 0 && popover)}
          anchorReference='anchorPosition'
          anchorPosition={popover}
          className={classes.popover}
          classes={{ paper: classes.popoverContent }}
        >
          <Box p={1}>
            <Typography>Value: {props.focusedState.yValue || 0}</Typography>
            <Typography>Step: {props.focusedState.xValue || 0}</Typography>
          </Box>
        </Popover>
      )}
    </Grid>
  );
});

export default ChartPanel;
