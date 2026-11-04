import type { ChangeEvent, CSSProperties } from 'react';

type DateTimePickerProps = {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
    selectedDate?: Date,
  ) => void;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function DateTimePicker({
  value,
  mode = 'date',
  minimumDate,
  onChange,
}: DateTimePickerProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.currentTarget.value;
    onChange?.(event, selectedValue ? parseDate(selectedValue) : undefined);
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    minHeight: 44,
    padding: '10px 12px',
    border: '1px solid #3f3f46',
    borderRadius: 8,
    backgroundColor: '#18181b',
    color: '#fff',
    colorScheme: 'dark',
    font: 'inherit',
  };

  return (
    <input
      aria-label="Selecionar data"
      type={mode === 'time' ? 'time' : 'date'}
      value={formatDate(value)}
      min={minimumDate ? formatDate(minimumDate) : undefined}
      onChange={handleChange}
      style={inputStyle}
    />
  );
}