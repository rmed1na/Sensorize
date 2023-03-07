import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

// Fonts
let fonts = {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
};

// Colors
let colors = {
    brand: {
      50: '#e8f4fc',
      100: '#cfdce2',
      200: '#b4c3cb',
      300: '#97abb5',
      400: '#7b939f',
      500: '#617a85',
      600: '#4b5f68',
      700: '#34444b',
      800: '#1c292f',
      900: '#001014',
    }
};

// Components
let components = {
    FormLabel: {
        baseStyle: {
            fontWeight: '500',
            fontSize: '0.875rem'
        }
    },
    Input: {
        defaultProps: {
            fontSize: '0.875rem'
        },
        sizes: {
            md: {
                field: {
                    fontSize: '0.875rem'
                }
            }
        }
    },
    Button: {
        baseStyle: {
            fontWeight: '400'
        }
    },
    Heading: {
        baseStyle: {
            color: 'brand.700'
        }
    }
}

const theme = extendTheme({
    fonts: fonts,
    colors: colors,
    components: components
}, withDefaultColorScheme({ 
    colorScheme: 'brand',
    components: ['Button', 'Heading', 'InputLeftAddon']
 }));

console.log('theme', theme);
export default theme;