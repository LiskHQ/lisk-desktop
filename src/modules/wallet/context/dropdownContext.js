// istanbul ignore file
import { createContext } from 'react';

const DropdownContext = createContext({ onChange: () => {}, selectedValue: null });

export default DropdownContext;
