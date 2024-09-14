import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { GoChevronDown } from 'react-icons/go';
import useOutsideClick from '../../hooks/useOutsideClick';
import './index.less';

interface DropdownItem {
  id: string;
  name: string;
}

interface DropdownProps {
  id: string;
  title?: string;
  data: DropdownItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  style?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const Dropdown = ({
  id,
  title = 'Select',
  data,
  position = 'bottom-left',
  style,
  selectedId,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(
    selectedId ? data?.find((item) => item.id === selectedId) : null
  );

  const selectedItemRef = useRef<DropdownItem | null>(
    selectedId ? data?.find((item) => item.id === selectedId) : null
  );

  const handleChange = (item: DropdownItem) => {
    onSelect && onSelect(item.id);
    setSelectedItem(item);
    selectedItemRef.current = item;
    setIsOpen(false);
  };

  useEffect(() => {
    selectedItemRef.current = title;
  },[title])

  useEffect(() => {
    if (selectedId && data) {
      const newSelectedItem = data.find((item) => item.id === selectedId);
      newSelectedItem && setSelectedItem(newSelectedItem);
    } else {
      setSelectedItem(undefined);
    }
  }, [selectedId, data]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  // const dropdownClass = classNames(
  //   'absolute bg-gray-100 w-max max-h-52 overflow-y-auto py-3 rounded shadow-md z-10',
  //   {
  //     'top-full right-0 mt-2': position === 'bottom-right',
  //     'top-full left-0 mt-2': position === 'bottom-left',
  //     'bottom-full right-0 mb-2': position === 'top-right',
  //     'bottom-full left-0 mb-2': position === 'top-left',
  //   }
  // );

  return (
    <div ref={dropdownRef} style={{display: 'relative'}}>
      <button
        id={id}
        aria-label='Toggle dropdown'
        aria-haspopup='true'
        aria-expanded={isOpen}
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className="SelectButton"
      >
        <span>{selectedItemRef.current?.name || title}</span>
        {
          isOpen ?  
          <GoChevronDown
          size={20}
          className="IconOpenAnimation"/> : 
          <GoChevronDown
          size={20}
          className="IconAnimation"/>
        }
        
      </button>
      {/* Open */}
      {isOpen && (
        <div aria-label='Dropdown menu' className='Dropdown'>
          <ul
            role='menu'
            aria-labelledby={id}
            aria-orientation='vertical'
            className='leading-10'
          >
            {data?.map((item) => (

                selectedItem?.id === item.id ? (
                  <li
                key={item.id}
                onClick={() => handleChange(item)}
                className="SelectedItem">
                  <span>{item.name}</span>
                </li>
                ) : (
                  <li
                key={item.id}
                onClick={() => handleChange(item)}
                className="OtherItems">
                  <span>{item.name}</span>
                </li>
                ) 
                
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;