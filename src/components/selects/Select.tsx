import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type SelectOption<T> = {
  id: string;
  value: T;
  label: string;
};

type SelectProps<T> = {
  options: SelectOption<T>[];
  selectedOption: SelectOption<T> | null;
  onChanged: (opt: SelectOption<T>) => void;
};

export const Select = <T,>({
  options,
  selectedOption,
  onChanged,
}: SelectProps<T>) => {
  return (
    <Listbox value={selectedOption} onChange={onChanged}>
      <>
        {/*label && (
            <Listbox.Label className="mb-1 text-sm font-medium text-blue-gray-500">
              {label}
            </Listbox.Label>
          )*/}
        <div className='relative mt-1'>
          <span className='inline-block w-full rounded-md shadow-sm'>
            <Listbox.Button className='relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left  transition duration-150 ease-in-out'>
              <span className='block truncate'>
                {selectedOption?.label ?? 'Select Token'}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
                <Selector />
              </span>
            </Listbox.Button>
          </span>
          <div className='absolute z-10 mt-1 mb-11 w-full rounded-md bg-white shadow-lg'>
            {/* bottom-0 will open the select menu up & mb-11 will put the dropup above the select option */}
            <Transition
              leave='transition duration-100 ease-in'
              leaveFrom='transform opacity-100'
              leaveTo='transform opacity-0'
            >
              <Listbox.Options
                static
                className='max-h-56 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
              >
                {options.map((option) => {
                  return (
                    <Listbox.Option
                      as={Fragment}
                      key={option.id}
                      value={option}
                    >
                      {({ active, selected }) => {
                        return (
                          <li
                            className={`${
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900'
                            } relative cursor-default select-none py-2 pl-3 pr-9`}
                          >
                            <div className='flex items-center'>
                              <span
                                className={`${
                                  selected ? 'font-semibold' : 'font-normal'
                                } block flex items-center truncate`}
                              >
                                {option.label}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? 'text-white' : 'text-indigo-600'
                                  } absolute inset-y-0 right-0 mr-3 flex items-center pl-1.5`}
                                >
                                  <Selected />
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      }}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      </>
    </Listbox>
  );
};

const Selector = () => (
  <svg
    className='h-5 w-5 text-gray-400'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
    aria-hidden='true'
  >
    <path
      fillRule='evenodd'
      d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
      clipRule='evenodd'
    />
  </svg>
);

const Selected = () => (
  <svg
    className='h-5 w-5'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
    />
  </svg>
);
