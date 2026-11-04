import type { CSSProperties } from 'react';
import { useState } from 'react';

type CalendarProps = {
  minDate?: string;
  onDayPress?: (day: { dateString: string }) => void;
  markedDates?: Record<
    string,
    { selected?: boolean; selectedColor?: string }
  >;
  theme?: Record<string, string | number>;
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function Calendar({
  minDate,
  onDayPress,
  markedDates = {},
  theme = {},
}: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate = minDate ? new Date(`${minDate}T12:00:00`) : new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = visibleMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const backgroundColor = String(theme.calendarBackground ?? '#1A1A1A');
  const textColor = String(theme.dayTextColor ?? '#FFF');
  const mutedColor = String(theme.textDisabledColor ?? '#555');
  const accentColor = String(theme.arrowColor ?? '#A855F7');
  const headerColor = String(theme.textSectionTitleColor ?? '#888');
  const monthStyle: CSSProperties = {
    color: String(theme.monthTextColor ?? textColor),
    fontWeight: String(theme.textMonthFontWeight ?? '700'),
    fontSize: Number(theme.textMonthFontSize ?? 18),
    textTransform: 'capitalize',
  };

  return (
    <section
      aria-label="Calendário de agendamento"
      style={{
        padding: 8,
        borderRadius: 14,
        backgroundColor,
        color: textColor,
        fontFamily: 'inherit',
      }}
    >
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 44px',
          alignItems: 'center',
          minHeight: 44,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
          style={{ color: accentColor, background: 'transparent', border: 0, fontSize: 26, cursor: 'pointer' }}
        >
          ‹
        </button>
        <strong style={monthStyle}>{monthLabel}</strong>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
          style={{ color: accentColor, background: 'transparent', border: 0, fontSize: 26, cursor: 'pointer' }}
        >
          ›
        </button>
      </header>

      <div
        role="grid"
        aria-label={monthLabel}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 2 }}
      >
        {weekDays.map((weekDay) => (
          <div
            key={weekDay}
            role="columnheader"
            style={{ color: headerColor, textAlign: 'center', padding: '6px 0', fontSize: 12, fontWeight: 600 }}
          >
            {weekDay}
          </div>
        ))}

        {Array.from({ length: firstWeekday }, (_, index) => (
          <span key={`empty-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const date = new Date(year, month, index + 1);
          const key = dateKey(date);
          const isDisabled = Boolean(minDate && key < minDate);
          const marking = markedDates[key];
          const isSelected = Boolean(marking?.selected);

          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              aria-label={date.toLocaleDateString('pt-BR')}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => onDayPress?.({ dateString: key })}
              style={{
                aspectRatio: '1',
                minWidth: 0,
                border: 0,
                borderRadius: '50%',
                backgroundColor: isSelected ? marking?.selectedColor ?? accentColor : 'transparent',
                color: isSelected ? String(theme.selectedDayTextColor ?? '#FFF') : isDisabled ? mutedColor : textColor,
                opacity: isDisabled ? 0.45 : 1,
                font: 'inherit',
                fontSize: Number(theme.textDayFontSize ?? 15),
                fontWeight: String(theme.textDayFontWeight ?? '500'),
                cursor: isDisabled ? 'default' : 'pointer',
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </section>
  );
}