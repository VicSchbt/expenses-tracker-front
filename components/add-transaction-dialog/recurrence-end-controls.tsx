'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RecurrenceEndMode = 'none' | 'endDate' | 'endCount';

export interface RecurrenceEndState {
  recurrenceEndMode: RecurrenceEndMode;
  recurrenceEndDate: string;
  recurrenceCount: string;
}

interface RecurrenceEndControlsProps {
  state: RecurrenceEndState;
  minDate: string;
  noEndDescription: string;
  onChange: (nextState: RecurrenceEndState) => void;
  idPrefix: string;
}

export function RecurrenceEndControls({
  state,
  minDate,
  noEndDescription,
  onChange,
  idPrefix,
}: RecurrenceEndControlsProps) {
  const onModeChange = (value: string): void => {
    onChange({
      ...state,
      recurrenceEndMode: value as RecurrenceEndMode,
    });
  };

  const onDateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({
      ...state,
      recurrenceEndDate: event.target.value,
    });
  };

  const onCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({
      ...state,
      recurrenceCount: event.target.value,
    });
  };

  const endDateOptionId = `${idPrefix}-recurrence-end-date-option`;
  const endDateInputId = `${idPrefix}-recurrence-end-date`;
  const endCountOptionId = `${idPrefix}-recurrence-count-option`;
  const endCountInputId = `${idPrefix}-recurrence-count`;
  const noneOptionId = `${idPrefix}-recurrence-none-option`;

  return (
    <div className="space-y-3 rounded-md border bg-background/40 p-3">
      <Label>Recurrence end</Label>
      <RadioGroup
        value={state.recurrenceEndMode}
        onValueChange={onModeChange}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="endDate" id={endDateOptionId} />
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center">
            <Label htmlFor={endDateOptionId} className="text-sm font-normal">
              On
            </Label>
            <Input
              id={endDateInputId}
              type="date"
              value={state.recurrenceEndDate}
              onChange={onDateChange}
              min={minDate}
              disabled={state.recurrenceEndMode !== 'endDate'}
              className="sm:max-w-[190px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="endCount" id={endCountOptionId} />
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center">
            <Label htmlFor={endCountOptionId} className="text-sm font-normal">
              After
            </Label>
            <div className="flex items-center gap-1">
              <Input
                id={endCountInputId}
                type="number"
                min="1"
                step="1"
                value={state.recurrenceCount}
                onChange={onCountChange}
                placeholder="4"
                disabled={state.recurrenceEndMode !== 'endCount'}
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">times</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="none" id={noneOptionId} />
          <div className="flex flex-col">
            <Label htmlFor={noneOptionId} className="text-sm font-normal">
              No end
            </Label>
            <p className="text-xs text-muted-foreground">{noEndDescription}</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}


