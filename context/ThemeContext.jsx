import { createContext, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';

const ThemeContext = createContext({ Colors, Fonts });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ Colors, Fonts }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);