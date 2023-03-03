import store from 'redux/store';
import GlobalStyle from 'libs/style/Globalstyle';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme';

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
