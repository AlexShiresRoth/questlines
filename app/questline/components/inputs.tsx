import { TAILWIND_400_COLORS } from '@/app/constants';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export const UIError = ({ messages }: { messages?: string[] }) => {
  return (
    !!messages && (
      <div className="flex flex-wrap items-center absolute -bottom-6 left-2">
        {messages.map((message) => (
          <p className="text-red-400 text-sm" key={message}>
            {message}
          </p>
        ))}
      </div>
    )
  );
};

export const InputContainer = ({
  children,
  colspan,
}: {
  children: ReactNode;
  colspan?: number;
}) => {
  return (
    <div
      className={clsx('flex flex-col gap-1 w-full relative', {
        'col-span-2': colspan === 2,
      })}
    >
      {children}
    </div>
  );
};

export const Label = ({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) => {
  return (
    <label htmlFor={name} className="text-orange-100">
      {children}
    </label>
  );
};

export const TextInput = ({
  name,
  placeholder,
  defaultValue,
  maxLength,
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
  maxLength?: number;
}) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      maxLength={maxLength}
      className="w-full p-2 indent-2 rounded-xl text-orange-50 border-0 bg-white/40 hover:ring-4 hover:ring-orange-400 transition-colors placeholder:text-black/30 focus:outline-none focus:ring-orange-400 focus:ring-4"
    />
  );
};

const ColorRender = ({
  color,
  setValue,
  value,
}: {
  color: { value: string; className: string };
  setValue: (val: string) => void;
  value: string;
}) => {
  return (
    <div
      key={color.value}
      className={clsx(
        'flex w-10 h-10 rounded-lg hover:ring-2 ring-orange-50 cursor-pointer transition-colors',
        {
          [color.className]: !!color.value,
          'ring-2': value == color.value,
        }
      )}
      onClick={() => setValue(color.value)}
    ></div>
  );
};

export const ColorPicker = ({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) => {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <div className="flex flex-wrap gap-2">
      {TAILWIND_400_COLORS.map((color, index) => {
        return (
          <ColorRender
            color={color}
            setValue={setValue}
            value={value}
            key={value + index}
          />
        );
      })}
      {value && (
        <input
          type="text"
          name={name}
          value={value}
          readOnly
          className="hidden"
        />
      )}
    </div>
  );
};

export const TextArea = ({
  name,
  placeholder,
  defaultValue,
  maxLength,
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
  maxLength?: number;
}) => {
  return (
    <textarea
      name={name}
      maxLength={maxLength}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full p-2 indent-2 text-orange-50 rounded-xl border-0 bg-white/40 hover:ring-4 hover:ring-orange-400 transition-colors placeholder:text-black/30 focus:outline-none focus:ring-orange-400 focus:ring-4"
    />
  );
};

export const DateInput = ({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) => {
  return (
    <input
      type="date"
      defaultValue={defaultValue}
      name={name}
      className="w-full p-2 indent-2 rounded-xl text-orange-50 border-0 bg-white/40 hover:ring-4 hover:ring-orange-400 transition-colors placeholder:text-black/30 focus:outline-none focus:ring-orange-400 focus:ring-4"
    />
  );
};
