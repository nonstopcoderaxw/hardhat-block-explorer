import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { classNames } from "../../utils/utils"


export type State<T> = {
  value: T,
  setter: React.Dispatch<React.SetStateAction<T>>
}

export type UIComboboxesInput = {
    items: string[],
    defaultItem: string | null,
    onChange: (address: string) => void | null,
    _query? : State<string>,
    _selected? : State<string>
}

export default function Comboboxes({items, defaultItem, onChange, _query, _selected}: UIComboboxesInput) {
if(!_query) return null;
  // const [query, setQuery] = useState('')
  // const [selected, setSelected] = useState(defaultItem)
  const [ query, setQuery ] = [ _query!.value, _query!.setter ];
  const [ selected, setSelected ] = [ _selected!.value, _selected!.setter ];

  const onChangeHandlder = (item) => {
    onChange(item);
    setSelected(item);
  }

  const filtered =
    query === ''
      ? items
      : items.filter((item) => {
          return item.includes(query)
        })
  const displayValueHandler = (item) => {
    return item;
  }

  return (
    <Combobox as="div" value={selected} onChange={onChangeHandlder}>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => { setQuery(event.target.value)} } 
          displayValue={displayValueHandler}
          onBlur={(event)=>{setSelected(event.target.value)}}
        />
        <Combobox.Button onClick={(event) => setQuery("")} className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((item, i) => (
              <Combobox.Option
                key={i}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>{item}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
