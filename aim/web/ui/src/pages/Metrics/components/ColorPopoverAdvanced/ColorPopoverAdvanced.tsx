import React from 'react';
import { Box, Radio, Switch } from '@material-ui/core';

import { IGroupingPopoverAdvancedProps } from 'types/components/GroupingPopover/GroupingPopover';
import COLORS from 'config/colors/colors';

import './ColorPopoverAdvanced.scss';

function ColorPopoverAdvanced({
  onPersistenceChange,
  onGroupingPaletteChange,
  persistence,
  paletteIndex,
}: IGroupingPopoverAdvancedProps): React.FunctionComponentElement<React.ReactNode> {
  function onPaletteChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = e.target;
    if (onGroupingPaletteChange) {
      onGroupingPaletteChange(parseInt(value));
    }
  }
  return (
    <div className='ColorPopoverAdvanced__container'>
      <div className='ColorPopoverAdvanced__persistence'>
        <h3 className='subtitle'>colors persistence</h3>
        <p className='ColorPopoverAdvanced__persistence__p'>
          Enable persistent coloring mode so that each item always has the same
          color regardless of its order.
        </p>
        <div>
          <Switch color='primary' />
          <span className='ColorPopoverAdvanced__container__span'>Enable</span>
        </div>
      </div>
      <div className='ColorPopoverAdvanced__preferred__colors'>
        <h3 className='subtitle'>Preferred color palette:</h3>
        <div>
          {COLORS.map((options, index) => (
            <Box key={index} display='flex' alignItems='center'>
              <Radio
                color='primary'
                checked={paletteIndex === index}
                onChange={onPaletteChange}
                size='small'
                value={index}
              />
              <span className='ColorPopoverAdvanced__container__span'>
                {index === 0 ? '8 distinct colors' : '24 colors'}{' '}
              </span>
              <div
                className={`ColorPopoverAdvanced__paletteColors__container ${
                  paletteIndex === index ? 'active' : ''
                }`}
              >
                {options.map((color) => (
                  <Box
                    key={color}
                    component='span'
                    className='ColorPopoverAdvanced__paletteColors_colorItem'
                    bgcolor={color}
                  />
                ))}
              </div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPopoverAdvanced;